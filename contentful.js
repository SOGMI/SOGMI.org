// contentful.js v4.x.x
const contentful = require('contentful')
var slugify = require('slugify')
const mkdirp = require('mkdirp')
var fs = require('fs')
var dotenv = require("dotenv").config()

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_TOKEN
})

function writeEntriesForType(contentType) {
    let totalEntries = 0;
    client.getEntries({
        content_type: contentType.sys.id,
        limit: 1000,
        order: 'sys.updatedAt'
    })
    .then((response) => {
        for (let item of response.items) {
            var fileContent = `---\nupdated: ${item.sys.updatedAt}\n`;
            for (let field of Object.keys(item.fields)) {
                if (field == 'content')
                    continue
                switch (typeof(item.fields[field])) {
                    case 'object':
                        // Single Assets i.e. photos and videos
                        if ('sys' in item.fields[field]) {
                            switch(item.fields[field].sys.type) {
                                case 'Asset':
                                    fileContent += `${field}: ${JSON.stringify(item.fields[field].fields.file.url)}\n`
                                    break
                                default:
                                    continue
                            }
                        } 
                        // Arrays
                        else {
                            var itemResult = item.fields[field]
                            // Linked entries will give "title" "contentType" "slug" and Entry ID
                            // Linked assets will give a "title" "description" and "url"
                            var arrayList = ``
                            var oj = Object.getOwnPropertyDescriptor
                            for(var i = 0; i < itemResult.length; i++ ) {
                                x = itemResult[i]
                                if(typeof(x) !== `object`) {
                                    arrayList += `- ` + x + `\n`
                                }
                                else if(Object.getOwnPropertyDescriptor(x.sys, 'type' ).value === 'Asset') {
                                    arrayList += `- title: ` + oj(x.fields, "title").value + `\n  url: ` + oj(x.fields.file, "url").value + `\n`
                                    if(typeof oj(x.fields, "description") !== 'undefined'){
                                        arrayList += `  description: ` + oj(x.fields, "description").value + `\n`
                                    }
                                }
                                else {
                                    arrayList += `- title: ` + oj(x.fields, 'title').value + `\n  slug: ` + oj(x.fields, 'slug').value +
                                    `\n  contentType: ` + oj(x.sys.contentType.sys, "id").value + `\n  id: ` + oj(x.sys, 'id').value + `\n`
                                }
                            }
                            if (itemResult.lon !== undefined) {
                                fileContent += `${field}:\n  longitude: ${itemResult.lon}\n  latitude: ${itemResult.lat}\n`
                            }
                            else {
                                fileContent += `${field}:\n${arrayList}`
                            }
                            arrayList = ``
                        }
                        break;
                    // Simple text content
                    default:
                        if (field === 'date' || field === 'startDate' || field === 'endDate') {
                            let entryDate = Date.parse(item.fields[field])
                            let newDate = new Date(entryDate)
                            let year = newDate.getFullYear()
                            let month = ("0" + (newDate.getMonth() + 1)).slice(-2)
                            let day = ("0" + newDate.getDate()).slice(-2)
                            let hour = ("0" + newDate.getHours()).slice(-2);
                            let minutes = ("0" + newDate.getMinutes()).slice(-2);
                            let millisec = ("0" + newDate.getMilliseconds()).slice(-2);

                            fileContent += `${field}: ${year}-${month}-${day}T${hour}:${minutes}:${millisec}.000Z\n`

                        }
                        else {
                            fileContent += `${field}: ${JSON.stringify(item.fields[field])}\n`
                        }
                }
            }
            fileContent += '---\n'

            // field with ID 'content' will be set as the main content in the .md file 
            if ('content' in item.fields) {
                fileContent += `${item.fields['content']}\n`
            }
            
            // create folder for all content types except for "podcastSeries" and "blogCollection"
            if (contentType.sys.id !== 'podcastSeries' && contentType.sys.id !== 'blogCollection') {
                mkdirp.sync(`./content/${contentType.sys.id}`)
            }

            if (contentType.sys.id == 'live') {
                fs.writeFile(`./content/${contentType.sys.id}/${slugify('_index')}.md`, fileContent, (error) => { /* handle error */ })
                // console.log("[Contentful Import] " + item.sys.id + ".md created in /content/" + contentType.sys.id )
            }
            else if (contentType.sys.id == 'podcastSeries') {
                mkdirp.sync(`./content/series/${slugify(item.fields.slug)}`)
                fs.writeFile(`./content/series/${slugify(item.fields.slug)}/_index.md`, fileContent, (error) => { /* handle error */ })
                // console.log(`[Contentful Import] _index.md (${item.fields.title}) created in /content/series/${slugify(item.fields.slug)}`)
            }
            else if (contentType.sys.id == 'blogCollection') {
                mkdirp.sync(`./content/collections/${slugify(item.fields.slug)}`)
                fs.writeFile(`./content/collections/${slugify(item.fields.slug)}/_index.md`, fileContent, (error) => { /* handle error */ })
                // console.log(`[Contentful Import] _index.md (${item.fields.title}) created in /content/collections/${slugify(item.fields.slug)}`)
            }
            else {
            fs.writeFile(`./content/${contentType.sys.id}/${slugify(item.sys.id)}.md`, fileContent, (error) => { /* handle error */ })
                // console.log("[Contentful Import] " + item.sys.id + ".md created in /content/" + contentType.sys.id )
            }
            totalEntries++;
        }
        if (totalEntries === 1) {
            console.log(`${contentType.sys.id}: ${totalEntries} entry imported\n-----------`)
        }
        else {
            console.log(`${contentType.sys.id}: ${totalEntries} entries imported\n-----------`)
        }
    })
    .catch(console.error)
}


// client.getEntries()
// .then((response) => console.log(response.items))
// .catch(console.error)

client.getContentTypes({})
    .then((response) => {
        for (let contentType of response.items) {
            writeEntriesForType(contentType)
        }
    })
    .catch(console.error)

console.log("\n//////////////////////////////\n//////////////////////////////\n      CONTENTFUL IMPORT\n//////////////////////////////\n//////////////////////////////")