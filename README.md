# This is the Repository For SOGMI.org!

[SOGMI.org](http://sogmi.org) uses [Hugo](http:gohugo.io) to generate a static website from content stored in [Contentful](http://contentful.com). 

[Netlify](http://netlify.com) is used to host the website, and [Algolia](http://algolia.com) is used to power the search.

All content items (i.e. articles, videos, podcasts, ect) utilized in this site are the intellectual property of Sons of God Ministries International. You are however welcome to clone and/or use the source code of this project as an example for any of your endeavors. You may not take any content items and redistribute them as your own.

This site gives a basic example of how Contentful can be used to manage a Hugo website.

## Basic Concept

The concept is fairly straightforward. ```Contentful.js``` pulls all the records in a Contentful space and turns them into .md files which then are then stored in /content/ for Hugo. The .md files get arranged in subdirectories depending on the content type in Contentful. The .md filename is dependent on the "slug" field in Contentful, and the main content is assigned to the field with the field ID "content".

The code in the Contentful.js file was taken from [this repository](https://github.com/ithic/contentful-hugo) by [ithic](https://github.com/ithic) then modified and updated for use on this project.

## Usage

### Prerequisites
Before you can start working in a local environment you need to download [node](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm). I recommend the latest LTS version for Node.

After that clone this repository and run the following in your command line.

```npm install```

Make sure you are in the same directory as the repository when you run the command. This will download all of the dependencies related to the project.

### Environment Variables

In order to get the content from Contentful, and send content to Algolia you need to create a .env file in the root directory of the project and add the appropriate API keys so that you can access the information in your local environment.

Create the .env file and fill out the information as follows:

```ALGOLIA_ADMIN_KEY = "[[ADMIN KEY]]"
ALGOLIA_APP_ID = "[[APP ID]]"
ALGOLIA_INDEX_FILE = "public/algolia.json"
ALGOLIA_INDEX_NAME = "[[INDEX NAME]]"
CONTENTFUL_SPACE = "[[CONTENTFUL SPACE ID]]"
CONTENTFUL_TOKEN = "[[CONTENTFUL ACCESS TOKEN]]"
```
SOGMI staff who wish to play around with this in a local environment message Josh so he can forward you the access keys.

### Development

While developing the site you can use:

```npm run test```

This will pull all the Records in contentful and put it in the "content" folder and then make a live version of the website available at http://localhost:1313/. You can open the browser to view the website at that link as you make changes to the templates. All changes will update automatically as you work so you don't need to refresh the page.

Press "ctrl+c" to cancel the live server.

### Complete List of CLI Commands

Here's a complete list of your available cli scripts.

| Command   | Result                      |
|----------------|-----------------------------|
| hugo | Creates static html files from the items in /content/ and dumps them in /public/ |
| hugo server | Creates a live site at http://localhost:1313/ from the items in /content/ based on the templates in /layouts/ |
| node contentful.js | Dumps contentful records into "content" folder as .md files. The file names are based on the slug set in Contentful. Items without a slug do not get pulled |
| npm run test | Runs "node contentful.js" and then runs hugo "server" |
| npm run algolia | Sends /public/algolia.json file to Algolia to add new search items and update current items. If "hugo" has not been run nothing will send as /public/algolia.json hasn't been created |
| npm run publish | Script to publish website. It pulls content from contentful, creates html files from /content/ and publishes them in the /public/ directory, compresses all html, css, json, and javascript files, and then sends search items to Algolia. |

### Structure

```|--archetypes           // Archetypes for hugo. Not relevant unless you will be creating .md with Hugo's command structure instead of fetching content from Contentful.
|--content              // Content that hugo will render
|--layouts              // This is where all the templates go (For more info on Hugo template structure see Hugo docs at https://gohugo.io)
    |--partials         // All partial templates go here (i.e. "header.html" or "sidebar.html")
    |--index.html       // Homepage template
|--static               // Static file folder
    |--css              // CSS files go here. They can be called in templates at /css/FILENAME.CSS
    |--js               // Client Side Javascript Files go here. They can be called in templates at /js/FILENAME.JS
    |--img              // Image Folder. Any non-Contentful images will be stored here. /img/FILENAME.JPG
    |--fonts            // Font Folder. /fonts/FILENAME.EXT
.gitignore              // Tells git which files to ignore for source control.
config.toml             // Config file for Hugo
netlify.toml            // TOML file for Netlify. Includes information for Netlify to use during the build process. (i.e. What version of Node. What scripts to run. ect.)
package.json            // Tells npm our project dependancies and scripts
contentful.js           // Script to pull records from contentful and spit them out and .md files for Hugo.
wait.js                 // Script that forces NPM to wait for 6 seconds before continuing. I use this to delay pulling from the Contentful API after the webhook so the data has time to propogate, otherwise it can result in the script not pulling the new information due to it triggering too fast.
```
