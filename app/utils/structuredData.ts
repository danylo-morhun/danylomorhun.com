/** Who the site is about. The same on every page. */
export interface SiteIdentity {
  /** Site root, no trailing slash: https://www.danylomorhun.com */
  url: string
  name: string
  jobTitle: string
  email: string
  sameAs: string[]
}

/** The page being described. */
export interface PageInfo {
  /** Canonical absolute URL. */
  url: string
  /** BCP 47 tag, e.g. uk-UA. */
  language: string
  title: string
  description: string
}

export interface ProjectInfo {
  name: string
  description: string
  image?: string
  home: { name: string, url: string }
}

type Node = Record<string, unknown>

const personId = (site: SiteIdentity) => `${site.url}/#person`
const websiteId = (site: SiteIdentity) => `${site.url}/#website`

function personNode(site: SiteIdentity): Node {
  return {
    '@type': 'Person',
    '@id': personId(site),
    'name': site.name,
    'url': site.url,
    'jobTitle': site.jobTitle,
    'email': `mailto:${site.email}`,
    'sameAs': site.sameAs,
  }
}

function websiteNode(site: SiteIdentity, page: PageInfo): Node {
  return {
    '@type': 'WebSite',
    '@id': websiteId(site),
    'url': site.url,
    'name': site.name,
    'inLanguage': page.language,
    'publisher': { '@id': personId(site) },
  }
}

function pageNode(type: string, site: SiteIdentity, page: PageInfo): Node {
  return {
    '@type': type,
    '@id': `${page.url}#webpage`,
    'url': page.url,
    'name': page.title,
    'description': page.description,
    'inLanguage': page.language,
    'isPartOf': { '@id': websiteId(site) },
  }
}

function graph(nodes: Node[]) {
  return { '@context': 'https://schema.org', '@graph': nodes }
}

/** Home page: a profile page about the person. */
export function profilePageGraph(site: SiteIdentity, page: PageInfo) {
  return graph([
    personNode(site),
    websiteNode(site, page),
    { ...pageNode('ProfilePage', site, page), mainEntity: { '@id': personId(site) } },
  ])
}

/** Case study or personal project: a page about one piece of work by the person. */
export function projectPageGraph(site: SiteIdentity, page: PageInfo, project: ProjectInfo) {
  const projectId = `${page.url}#project`
  const breadcrumbId = `${page.url}#breadcrumb`

  return graph([
    personNode(site),
    websiteNode(site, page),
    {
      ...pageNode('WebPage', site, page),
      mainEntity: { '@id': projectId },
      breadcrumb: { '@id': breadcrumbId },
    },
    {
      '@type': 'CreativeWork',
      '@id': projectId,
      'name': project.name,
      'description': project.description,
      'url': page.url,
      'inLanguage': page.language,
      'creator': { '@id': personId(site) },
      ...(project.image && { image: project.image }),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': project.home.name, 'item': project.home.url },
        { '@type': 'ListItem', 'position': 2, 'name': project.name, 'item': page.url },
      ],
    },
  ])
}

export interface PostInfo {
  title: string
  description: string
  /** YYYY-MM-DD */
  date: string
  updated?: string
  tags: string[]
  blog: { name: string, url: string }
}

/** One blog post, written by the person, inside the blog. */
export function blogPostingGraph(site: SiteIdentity, page: PageInfo, post: PostInfo) {
  const postId = `${page.url}#post`
  const breadcrumbId = `${page.url}#breadcrumb`

  return graph([
    personNode(site),
    websiteNode(site, page),
    {
      ...pageNode('WebPage', site, page),
      mainEntity: { '@id': postId },
      breadcrumb: { '@id': breadcrumbId },
    },
    {
      '@type': 'BlogPosting',
      '@id': postId,
      'headline': post.title,
      'description': post.description,
      'url': page.url,
      'mainEntityOfPage': { '@id': `${page.url}#webpage` },
      'inLanguage': page.language,
      'datePublished': post.date,
      'dateModified': post.updated ?? post.date,
      'keywords': post.tags,
      'author': { '@id': personId(site) },
      'publisher': { '@id': personId(site) },
      'isPartOf': { '@type': 'Blog', '@id': `${post.blog.url}#blog`, 'name': post.blog.name, 'url': post.blog.url },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': site.url },
        { '@type': 'ListItem', 'position': 2, 'name': post.blog.name, 'item': post.blog.url },
        { '@type': 'ListItem', 'position': 3, 'name': post.title, 'item': page.url },
      ],
    },
  ])
}

/** The blog index: a blog by the person, listing its posts. */
export function blogGraph(site: SiteIdentity, page: PageInfo, posts: Array<{ title: string, url: string, date: string }>) {
  return graph([
    personNode(site),
    websiteNode(site, page),
    { ...pageNode('CollectionPage', site, page), mainEntity: { '@id': `${page.url}#blog` } },
    {
      '@type': 'Blog',
      '@id': `${page.url}#blog`,
      'name': page.title,
      'description': page.description,
      'url': page.url,
      'inLanguage': page.language,
      'author': { '@id': personId(site) },
      'blogPost': posts.map(post => ({
        '@type': 'BlogPosting',
        '@id': `${post.url}#post`,
        'headline': post.title,
        'url': post.url,
        'datePublished': post.date,
      })),
    },
  ])
}
