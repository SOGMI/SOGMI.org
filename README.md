# This is the Repository For SOGMI.org

SOGMI.org uses [Hugo](http:gohugo.io) to generate a static website from content stored in [Contentful](http://contentful.com).

The static files are hosted on [Netlify](http://netlify.com), and [Algolia](http://algolia.com) is used to power the search.

All content (i.e. articles, videos, podcasts, ect) utilized in this site is the intellectual property of Sons of God Ministries International. You are however welcome to clone and/or use this project as an example for any of your endeavors.

## Usage

### Prerequesites
Before you can start working in a local environment you need to download [node](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm). I recommend the latest LTS version for Node.

After that clone this repository and run the following in your command line.

```npm install```

Make sure you are in the same directory as the repository when you run the command. This will download all of the dependencies related to the project.

### Development

While developing the site you can use:

```npm run test```

This will pull all the Records in contentful and put it in the "content" folder and then make a live version of the website available at http://localhost:1313/. You can open the browser to view the website at that link as you make changes to the templates. All changes will update automatically as you work so you don't need to refresh the page.

Press "ctrl+c" to cancel the live server.

### List of CLI Commands

Here's a complete list of your available cli scripts.

| Command   | Result                      |
|----------------|-----------------------------|
| hugo | Creates static html files from the items in "content" |
| hugo server | Creates a live site at http://localhost:1313/ from the items in "content" based on the templates in "layout" |
| node contentful.js | Dumps contentful records into "content" folder as .md files. The file names are based on the slug set in Contentful. Items without a slug do not get pulled |
| npm run test | Runs "node contentful.js" and then runs hugo "server" |
