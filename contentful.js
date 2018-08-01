// contentful.js v4.x.x
const contentful = require('contentful')
var slugify = require('slugify')
const mkdirp = require('mkdirp')
var fs = require('fs')

//not needed for some reason
//var argv = require('minimist')(process.argv.slice(2))

//reads environment variables from .env file
var dotenv = require("dotenv").config()

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_TOKEN
})

function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (value instanceof Array) {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}

function writeEntriesForType(contentType) {
    client.getEntries({
        content_type: contentType.sys.id
    })
    .then((response) => {
        for (let item of response.items) {
            var fileContent = '---\n';
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

                            // Old method. Only grabs standard arrays. Doesn't get linked content (assets or entries)
                            // fileContent += `${field}: ${JSON.stringify(itemResult)}\n`

                            // New method. Retrieves standard array content and linked content.
                            // Linked entries will give the entry id, and linked assets will give a "title" "description" and "url"
                            var arrayList = ``
                            for(var i = 0; i < itemResult.length; i++ ) {
                                value = itemResult[i]
                                if(typeof(value) !== `object`) {
                                    arrayList += `- ` + value + `\n`
                                }
                                else if(Object.getOwnPropertyDescriptor(value.sys, 'type' ).value === 'Asset') {
                                    var oj = Object.getOwnPropertyDescriptor
                                    arrayList += `- title: ` + oj(value.fields, "title").value + `\n  description: ` +
                                        oj(value.fields, "description").value + `\n  url: ` + oj(value.fields.file, "url").value + `\n`                                }
                                else {
                                    arrayList += `- ` + Object.getOwnPropertyDescriptor(value.sys, 'id').value + `\n`
                                }
                            }
                            fileContent += `${field}:\n${arrayList}`
                            arrayList = ``
                        }
                        break;
                    // Simple text content
                    default:
                    fileContent += `${field}: ${JSON.stringify(item.fields[field])}\n`
                }
            }
            fileContent += '---\n'

            // field with ID 'content' will be set as the main content in the .md file 
            if ('content' in item.fields)
                fileContent += `${item.fields['content']}\n`

            mkdirp.sync(`./content/${contentType.sys.id}`)

            if (contentType.sys.id == 'live') {
                fs.writeFile(`./content/${contentType.sys.id}/${slugify('_index')}.md`, fileContent, (error) => { /* handle error */ })
                console.log("[Contentful Import] " + item.sys.id + ".md created in /content/" + contentType.sys.id )
            } 
            else {
            fs.writeFile(`./content/${contentType.sys.id}/${slugify(item.sys.id)}.md`, fileContent, (error) => { /* handle error */ })
                console.log("[Contentful Import] " + item.sys.id + ".md created in /content/" + contentType.sys.id )
            }
        }
    })
    .catch(console.error)
}

// client.getEntries()
// .then((response) => console.log(response.items))
// .catch(console.error)

client.getContentTypes()
.then((response) => {
    for (let contentType of response.items) {
        writeEntriesForType(contentType)
    }
})
.catch(console.error)