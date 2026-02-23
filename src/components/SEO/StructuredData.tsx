import Script from 'next/script';

export function SoftareApplicationSchema() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'PaperCraft',
        operatingSystem: 'Any',
        applicationCategory: 'EducationalApplication',
        description: 'Advanced visual question paper builder for educators. Create exam-ready papers with AI-assisted generation and multi-language support.',
        offers: {
            '@type': 'Offer',
            price: '699',
            priceCurrency: 'INR',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250',
        },
    };

    return (
        <Script
            id="software-application-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export function OrganizationSchema() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PaperCraft Editorial Systems',
        url: 'https://papercraft-editorial.netlify.app',
        logo: 'https://papercraft-editorial.netlify.app/logo.png', // Assuming a logo exists or will be added
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-8208593432',
            contactType: 'customer service',
            email: 'spwebsmiths@gmail.com',
            areaServed: 'IN',
            availableLanguage: ['en', 'hi', 'mr'],
        },
    };

    return (
        <Script
            id="organization-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
