// contentful.js v4.x.x
const contentful = require('contentful')
var slugify = require('slugify')
const mkdirp = require('mkdirp')
var fs = require('fs')
var argv = require('minimist')(process.argv.slice(2))
var dotenv = require("dotenv").config()

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_TOKEN
})

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
                        //Single Assets i.e. photos and videos
                        if ('sys' in item.fields[field]) {
                            switch(item.fields[field].sys.type) {
                                case 'Asset':
                                    fileContent += `${field}: ${JSON.stringify(item.fields[field].fields.file.url)}\n`
                                    break
                                default:
                                    continue
                            }
                        } else {
                            //content links (WORK IN PROGRESS >.>)
                            //if ('0' in item.fields[field]) {
                            //    fileContent += `${field}: Test\n`
                            //} 
                            //standard arrays
                            //else {
                            fileContent += `${field}: ${JSON.stringify(item.fields[field])}\n`
                            //}
                        }
                        break;
                    default:
                        fileContent += `${field}: ${JSON.stringify(item.fields[field])}\n`
                }
            }
            fileContent += '---\n'

            if ('content' in item.fields)
                fileContent += `${item.fields['content']}\n`

            mkdirp.sync(`./content/${contentType.sys.id}`)

            if (contentType.sys.id == 'live') {
                fs.writeFile(`./content/${contentType.sys.id}/${slugify('_index')}.md`, fileContent, (error) => { /* handle error */ })
            } else {
            fs.writeFile(`./content/${contentType.sys.id}/${slugify(item.sys.id)}.md`, fileContent, (error) => { /* handle error */ })
            }
        }
    })
    .catch(console.error)
}

client.getContentTypes()
.then((response) => {
    for (let contentType of response.items) {
        writeEntriesForType(contentType)
    }
})
.catch(console.error)