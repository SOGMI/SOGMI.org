/**
 *
 * @param {import("contentful").Asset} input
 */
function assetToUrl(input) {
  return input?.fields?.file?.url ?? "";
}

/**
 * @type {import('contentful-hugo').ContentfulHugoConfig}
 */
module.exports = {
  singleTypes: [
    {
      id: "live",
      directory: "content/live",
      fileName: "_index",
      fileExtension: "md",
      mainContent: "content",
      overrides: {
        featuredImage: {
          valueTransformer: assetToUrl,
        },
      },
    },
  ],
  repeatableTypes: [
    {
      id: "articles",
      directory: "content/articles",
      mainContent: "content",
      overrides: {
        featuredImage: {
          valueTransformer: assetToUrl,
        },
        collection: {
          valueTransformer(input) {
            return input?.fields?.slug;
          },
        },
      },
    },
    {
      id: "blogCollection",
      directory: "content/collections",
      overrides: {
        featuredImage: {
          valueTransformer: assetToUrl,
        },
      },
      isTaxonomy: true,
      fileName: "fields.slug",
    },
    {
      id: "events",
      directory: "content/events",
      mainContent: "content",
      overrides: {
        featuredImage: {
          valueTransformer: assetToUrl,
        },
      },
    },
    {
      id: "locations",
      directory: "content/locations",
      mainContent: "content",
      overrides: {
        featuredImage: {
          valueTransformer: assetToUrl,
        },
      },
    },
    {
      id: "people",
      directory: "content/people",
      overrides: {
        profilePhoto: {
          valueTransformer: assetToUrl,
        },
      },
    },
    {
      id: "podcasts",
      directory: "content/podcasts",
      overrides: {
        featuredImage: {
          valueTransformer: assetToUrl,
        },
      },
      mainContent: "content",
    },
    {
      id: "podcastSeries",
      directory: "content/series",
      isTaxonomy: true,
      fileName: "fields.slug",
      overrides: {
        albumImage: {
          valueTransformer: assetToUrl,
        },
        featuredImage: {
          valueTransformer: assetToUrl,
        },
      },
    },
    {
      id: "videos",
      directory: "content/videos",
    },
  ],
};
