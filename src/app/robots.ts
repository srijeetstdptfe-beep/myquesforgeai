import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/dashboard/', '/builder/'],
        },
        sitemap: 'https://quesforgeai-in.netlify.app/sitemap.xml',
    };
}
