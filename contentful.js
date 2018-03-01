// contentful.js v4.x.x
const contentful = require('contentful')
var slugify = require('slugify')
const mkdirp = require('mkdirp')
var fs = require('fs')
var argv = require('minimist')(process.argv.slice(2));

const SPACE_ID = 'vfgh62eq5a4k'
const ACCESS_TOKEN = '00ae52ccc5d7e46ccbfcace0e86689f47068f627843cd0a7a7107824eb58b384'

const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: SPACE_ID,
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: ACCESS_TOKEN
})

/*const client = contentful.createClient({
  space: argv['space'] ? argv['space'] : process.env.CONTENTFUL_SPACE,
  accessToken: argv['token'] ? argv['token'] : process.env.CONTENTFUL_TOKEN
})*/

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
                        if ('sys' in item.fields[field]) {
                            switch(item.fields[field].sys.type) {
                                case 'Asset':
                                    fileContent += `${field}: ${JSON.stringify(item.fields[field].fields.file.url)}\n`
                                    break
                                default:
                                    continue
                            }
                        } else {
                            fileContent += `${field}: ${JSON.stringify(item.fields[field])}\n`
                        }
                        break;
                    default:
                        fileContent += `${field}: ${item.fields[field]}\n`
                }
            }
            fileContent += '---\n'

            if ('content' in item.fields)
                fileContent += `${item.fields['content']}\n`

            mkdirp.sync(`./content/${contentType.sys.id}`)
            fs.writeFile(`./content/${contentType.sys.id}/${slugify(item.fields.slug)}.md`, fileContent, (error) => { /* handle error */ })
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