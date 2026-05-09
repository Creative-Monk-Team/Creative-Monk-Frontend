import {
  Globe,
  Search,
  Share2,
  Palette,
  PenTool,
  BarChart2,
  ShoppingCart,
  Code,
  Megaphone,
  Target,
  TrendingUp,
  MousePointerClick,
  Users,
  FileText,
  Package,
  Sparkles,
  Image as ImageIcon,
  LayoutTemplate,
  type LucideIcon,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────
export type ServiceDetail = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  process: { step: string; desc: string }[];
  outcomes: string[];
  faqs: { question: string; answer: string }[];
  icon: LucideIcon;
  color: string;
  image: string;
  category: "web" | "marketing" | "design";
};

export type ServiceCategory = {
  title: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  services: string[]; // slugs
};

// ─── Service Categories ─────────────────────────────────────────────
export const serviceCategories: ServiceCategory[] = [
  {
    title: "Website Designing & Development",
    slug: "web-design",
    description:
      "Creative Monk is a leading web designing company in Chandigarh, India. The sites we create are spotless and modern, each extraordinarily structured. We provide the best web design services at an affordable price.",
    icon: Globe,
    services: [
      "wordpress-development",
      "ecommerce-development",
      "static-website",
      "dynamic-website",
      "landing-page",
      "shopify",
    ],
  },
  {
    title: "Digital Marketing Agency in India",
    slug: "digital-marketing",
    description:
      "Our association with professional experts who specialize in various digital marketing services like SEO, Social Media Marketing, PPC has enabled us to be one of the top digital marketing agencies in India.",
    icon: BarChart2,
    services: [
      "seo",
      "social-media-marketing",
      "sem",
      "ppc",
      "local-business-marketing",
      "lead-generation",
      "cro",
      "social-media-management",
      "branding",
    ],
  },
  {
    title: "Graphic Designing Services in India",
    slug: "graphic-designing",
    description:
      "The Creative Monk offers professional graphic design services in Chandigarh, India such as logo design, banner design, template design, packaging design, and social media poster design services.",
    icon: Palette,
    services: [
      "logo-designing",
      "print-design",
      "package-designing",
      "corporate-designing",
      "social-media-posters",
      "banner-designing",
    ],
  },
];

// ─── All Services (Detail Data) ─────────────────────────────────────
export const services: ServiceDetail[] = [
  // ════════════════════════════════════════════════════════════════════
  // WEB DESIGN & DEVELOPMENT
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "wordpress-development",
    title: "WordPress Development",
    shortTitle: "WordPress",
    tagline: "Powerful WordPress websites built to grow your business.",
    description:
      "Website Designing Company in Chandigarh– WordPress is the best Content Management System (CMS) platform used to develop web applications and websites across the world. Whether you are simply looking to build a robust business website, start a blog or integrate e-commerce, WordPress is the best platform for you. At Creative Monk which is the bestWordPress website Design Companyin India, we’ve delivered WordPress based websites, applications, themes, and plugins to hundreds of clients in Chandigarh, India and more. Our energetic, professional and experienced WordPress developers can help your business grow and scale in the digital marketplace.",
    longDescription:
      "Website Designing Company in Chandigarh– WordPress is the best Content Management System (CMS) platform used to develop web applications and websites across the world. Whether you are simply looking to build a robust business website, start a blog or integrate e-commerce, WordPress is the best platform for you. At Creative Monk which is the bestWordPress website Design Companyin India, we’ve delivered WordPress based websites, applications, themes, and plugins to hundreds of clients in Chandigarh, India and more. Our energetic, professional and experienced WordPress developers can help your business grow and scale in the digital marketplace. Creative Monk one of the bestWebsite Designing Company inChandigarhwill work with you to fulfil your branding needs and objectives.",
    features: [
      "Custom Theme Development",
      "Plugin Development & Integration",
      "WooCommerce Integration",
      "Speed & Performance Optimization",
      "Security Hardening",
      "SEO-Friendly Architecture",
    ],
    process: [
      { step: "Discovery", desc: "Understanding your business goals and requirements." },
      { step: "Design", desc: "Creating wireframes and visual designs for approval." },
      { step: "Development", desc: "Building custom WordPress theme and plugins." },
      { step: "Content", desc: "Populating pages with optimized content." },
      { step: "Launch", desc: "Testing, optimization, and going live." },
    ],
    outcomes: [
      "Fast loading websites",
      "Easy content management",
      "SEO-ready from day one",
      "Scalable architecture",
    ],
    faqs: [
      { question: "Can I update the website myself?", answer: "Yes! WordPress has an intuitive admin panel that lets you update content, images, and pages without any coding knowledge." },
      { question: "Is WordPress secure?", answer: "With proper security hardening, regular updates, and best practices, WordPress is very secure. We implement all necessary security measures." },
      { question: "How long does it take?", answer: "A standard WordPress website takes 2-4 weeks. Complex projects may take 4-8 weeks." },
    ],
    icon: Code,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
    category: "web",
  },
  {
    slug: "ecommerce-development",
    title: "Ecommerce Web Development",
    shortTitle: "Ecommerce",
    tagline: "Online stores that turn visitors into paying customers.",
    description:
      "Ecommerce Development Company in Chandigarhincludes buying and selling products or services on the internet from your website, not only inChandigarhit is from anywhere in the world. Ecommerce website development is the most affordable option to promote your business online. By developing an eCommerce website, you can reach your end prospective clients. Creative Monk is one of the leading companies inthe eCommerce website developmentfield inChandigarh, India. We aim to offer you customized eCommerce website development services that exactly match your requirements. Ecommerce website offers multiple payment options to your clients.",
    longDescription:
      "Ecommerce Development Company in Chandigarhincludes buying and selling products or services on the internet from your website, not only inChandigarhit is from anywhere in the world. Ecommerce website development is the most affordable option to promote your business online. By developing an eCommerce website, you can reach your end prospective clients. Creative Monk is one of the leading companies inthe eCommerce website developmentfield inChandigarh, India. We aim to offer you customized eCommerce website development services that exactly match your requirements. Ecommerce website offers multiple payment options to your clients. Our high qualified developers can easily manage product catalogue development to payment gateway integration, order tracking and processing, inventory tracking and discount functions.Creative Monkis the all in one solution to open youronline storeinChandigarh, India.",
    features: [
      "WooCommerce & Shopify Development",
      "Payment Gateway Integration",
      "Inventory Management",
      "Mobile-Responsive Design",
      "Product Catalog & Filters",
      "Order Tracking & Analytics",
    ],
    process: [
      { step: "Planning", desc: "Defining product structure and user flows." },
      { step: "Design", desc: "Creating conversion-focused store layouts." },
      { step: "Development", desc: "Building the store with payment and shipping." },
      { step: "Testing", desc: "End-to-end testing of the purchase flow." },
      { step: "Launch", desc: "Going live with marketing integrations." },
    ],
    outcomes: [
      "Higher conversion rates",
      "Seamless checkout experience",
      "Mobile-first shopping",
      "Easy product management",
    ],
    faqs: [
      { question: "Which ecommerce platform do you recommend?", answer: "It depends on your needs. WooCommerce is great for WordPress users, Shopify for ease of use, and custom solutions for unique requirements." },
      { question: "Can you integrate payment gateways?", answer: "Yes, we integrate Razorpay, PayU, Stripe, PayPal, and all major payment gateways." },
    ],
    icon: ShoppingCart,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop",
    category: "web",
  },
  {
    slug: "static-website",
    title: "Static Website Development",
    shortTitle: "Static Website",
    tagline: "Lightning-fast static websites for your business.",
    description:
      "As one of thefastest-growingstatic website designcompanies in Chandigarh, Creative Monk has been offering a wide array of website design and development services. With some of thebest static web designers in Chandigarhin our core team, we have been able to satisfy clients, promising them with optimized solutions often beyond their expectations. We are also one of thetop static website designing companies in Chandigarhand in being so, we offer excellent static websites, designed and developed as per your specific business requirements. So, let’s first understand what a static website is all about before moving on to our solutions in details.",
    longDescription:
      "As one of thefastest-growingstatic website designcompanies in Chandigarh, Creative Monk has been offering a wide array of website design and development services. With some of thebest static web designers in Chandigarhin our core team, we have been able to satisfy clients, promising them with optimized solutions often beyond their expectations. We are also one of thetop static website designing companies in Chandigarhand in being so, we offer excellent static websites, designed and developed as per your specific business requirements. So, let’s first understand what a static website is all about before moving on to our solutions in details. Today, the increasingly demanding competitive scenario has made every business entrepreneur understand the importance of a well-designed and extremely functional website. But before you step into the field of getting your website developed in an ideal manner, you need to know about the two most common types of websites you can have. These areStatic WebsitesandDynamic Websites. Now, simplistically put,static websitesare those that cannot have their content changed without its source code being edited by a developer.Dynamic websites, on the other hand, can display varying content from the same source code. Now, whether you go for a static website or a dynamic website should depend on the type of website being developed and whether the format is helping each of the webpages serve its designated purpose.",
    features: [
      "Ultra-Fast Loading Speed",
      "SEO Optimized",
      "Responsive Design",
      "Custom Animations",
      "Contact Form Integration",
      "Google Analytics Setup",
    ],
    process: [
      { step: "Requirement", desc: "Gathering content and design preferences." },
      { step: "Design", desc: "Creating pixel-perfect mockups." },
      { step: "Development", desc: "Building with clean, optimized code." },
      { step: "Optimization", desc: "Performance tuning and SEO setup." },
      { step: "Delivery", desc: "Deployment and handover." },
    ],
    outcomes: [
      "Sub-second load times",
      "Perfect SEO scores",
      "Zero maintenance",
      "Professional online presence",
    ],
    faqs: [
      { question: "What is a static website?", answer: "A static website has fixed content that doesn't change dynamically. It's ideal for informational sites, portfolios, and landing pages." },
      { question: "Can I update content later?", answer: "Yes, we can set up a content management system or provide easy-to-edit files." },
    ],
    icon: FileText,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=2069&auto=format&fit=crop",
    category: "web",
  },
  {
    slug: "dynamic-website",
    title: "Dynamic Website Development",
    shortTitle: "Dynamic Website",
    tagline: "Interactive, data-driven websites that engage users.",
    description:
      "Creative Monkprovides competitive cost and high-qualitydynamic website developmentinChandigarh. We are offering the best dynamic services with advanced functionality in Chandigarh. At Creative Monk, we are expert in creating a unique web presence for businesses and organizations. We have a tendency to develop customise Dynamic websites that meet individual business desires and budget.",
    longDescription:
      "Creative Monkprovides competitive cost and high-qualitydynamic website developmentinChandigarh. We are offering the best dynamic services with advanced functionality in Chandigarh. At Creative Monk, we are expert in creating a unique web presence for businesses and organizations. We have a tendency to develop customise Dynamic websites that meet individual business desires and budget. Dynamic website page designing requires an experienced programmer and creative designers team with good knowledge, our professionals are the master and mentor at their own who can design and develop dynamic website using a different scripting language, preferably PHP/MySQL and make your website good looking.",
    features: [
      "User Authentication & Accounts",
      "Database Integration",
      "Real-Time Content Updates",
      "Admin Dashboard",
      "API Integrations",
      "Interactive UI Components",
    ],
    process: [
      { step: "Analysis", desc: "Understanding functional requirements." },
      { step: "Architecture", desc: "Designing the system and database structure." },
      { step: "Development", desc: "Building frontend and backend." },
      { step: "Testing", desc: "Comprehensive QA and user testing." },
      { step: "Deployment", desc: "Launching with monitoring and support." },
    ],
    outcomes: [
      "Interactive user experience",
      "Scalable architecture",
      "Real-time updates",
      "Business automation",
    ],
    faqs: [
      { question: "What is a dynamic website?", answer: "A dynamic website generates content in real-time based on user interactions, database queries, or external data sources." },
      { question: "Do you provide backend development?", answer: "Yes, we handle full-stack development including backend APIs, databases, and server infrastructure." },
    ],
    icon: Globe,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    category: "web",
  },
  {
    slug: "landing-page",
    title: "Landing Page Design",
    shortTitle: "Landing Page",
    tagline: "High-converting landing pages designed for results.",
    description:
      "In online marketing, a landing page, sometimes known as a “lead capture page”, “destination page” that appears in response to clicking on a marketing promotion or an online advertisement.",
    longDescription:
      "In online marketing, a landing page, sometimes known as a “lead capture page”, “destination page” that appears in response to clicking on a marketing promotion or an online advertisement. “Thelanding page designwith complete call-to-action and the relevant landing page content would eventually attract an audience and convert them”. By specifically opting for alanding page design servicesin Chandigarh, you have a better chance of optimum user engagement.",
    features: [
      "Conversion-Focused Design",
      "A/B Testing Ready",
      "Lead Capture Forms",
      "Mobile Optimized",
      "Fast Loading Speed",
      "Analytics Integration",
    ],
    process: [
      { step: "Strategy", desc: "Defining conversion goals and audience." },
      { step: "Copywriting", desc: "Crafting persuasive messaging." },
      { step: "Design", desc: "Creating high-impact visual layouts." },
      { step: "Development", desc: "Building with performance in mind." },
      { step: "Optimize", desc: "Setting up tracking and A/B tests." },
    ],
    outcomes: [
      "Higher conversion rates",
      "Lower cost per lead",
      "Better ad ROI",
      "Clear call-to-actions",
    ],
    faqs: [
      { question: "How fast will my landing page load?", answer: "We optimize for sub-2-second load times, which is critical for conversion rates." },
      { question: "Can you write the copy too?", answer: "Yes, our team includes experienced copywriters who specialize in conversion-focused content." },
    ],
    icon: LayoutTemplate,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    category: "web",
  },
  {
    slug: "shopify",
    title: "Shopify Development",
    shortTitle: "Shopify",
    tagline: "Professional Shopify stores that sell.",
    description:
      "When it comes to the Shopify, it offers excellent benefits to the e-commerce site. It gives the successful things to the online businessmen. It is a necessary one for the online store developed by theShopify website development company in Chandigarh.The Creative Monkknow the use of the Shopify features used in the development. With the help of it, we build the perfect Shopify online store. It is an important platform for creating an online store. It is a highly secure platform that easy to manage by the user. The users can access the vast range of features and themes provided by the Shopify.Shopify web Development Company in Chandigarhmakes the customized and unique Shopify sites that beneficial for the online store. You can earn more money with this platform and engage more clients in the business. You can utilize theShopify development services in Chandigarhat the best price. It is considered as the top-rated solution for the e-commerce site.",
    longDescription:
      "When it comes to the Shopify, it offers excellent benefits to the e-commerce site. It gives the successful things to the online businessmen. It is a necessary one for the online store developed by theShopify website development company in Chandigarh.The Creative Monkknow the use of the Shopify features used in the development. With the help of it, we build the perfect Shopify online store. It is an important platform for creating an online store. It is a highly secure platform that easy to manage by the user. The users can access the vast range of features and themes provided by the Shopify.Shopify web Development Company in Chandigarhmakes the customized and unique Shopify sites that beneficial for the online store. You can earn more money with this platform and engage more clients in the business. You can utilize theShopify development services in Chandigarhat the best price. It is considered as the top-rated solution for the e-commerce site. When it comes to the Shopify, it offers excellent benefits to the e-commerce site. It gives the successful things to the online businessmen. It is a necessary one for the online store developed by theShopify website development company in Chandigarh.The Creative Monkknow the use of the Shopify features used in the development. With the help of it, we build the perfect Shopify online store. It is an important platform for creating an online store. It is a highly secure platform that easy to manage by the user. The users can access the vast range of features and themes provided by the Shopify.Shopify web Development Company in Chandigarhmakes the customized and unique Shopify sites that beneficial for the online store. You can earn more money with this platform and engage more clients in the business. You can utilize theShopify development services in Chandigarhat the best price. It is considered as the top-rated solution for the e-commerce site.",
    features: [
      "Custom Shopify Theme Design",
      "App Integration & Development",
      "Payment & Shipping Setup",
      "Product Page Optimization",
      "Inventory Management",
      "Migration from Other Platforms",
    ],
    process: [
      { step: "Planning", desc: "Store structure and product organization." },
      { step: "Design", desc: "Custom Shopify theme creation." },
      { step: "Setup", desc: "Products, payments, and shipping configuration." },
      { step: "Optimization", desc: "Speed, SEO, and conversion optimization." },
      { step: "Launch", desc: "Go live with training and support." },
    ],
    outcomes: [
      "Professional store design",
      "Seamless checkout",
      "Easy inventory management",
      "Scalable ecommerce",
    ],
    faqs: [
      { question: "Can you migrate my existing store?", answer: "Yes, we handle migrations from WooCommerce, Magento, and other platforms to Shopify." },
      { question: "Do you provide ongoing support?", answer: "Yes, we offer monthly maintenance and support packages for Shopify stores." },
    ],
    icon: ShoppingCart,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop",
    category: "web",
  },

  // ════════════════════════════════════════════════════════════════════
  // DIGITAL MARKETING
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "seo",
    title: "Search Engine Optimization",
    shortTitle: "SEO",
    tagline: "Dominate search results. Own your market.",
    description:
      "SEO Company in Chandigarh– What comes to your mind when you heard the term Search Engine Optimization or SEO (want to rank #1 on any search engine). The most popular search engine is GOOGLE, as we all depend on our daily life’s. By keeping an eye on the latest algorithms we provide thebest SEO services in Chandigarh, India. SEOservices help the business to get a high amount of relevant traffic to their websites without spending more money. It has been proven that more than 80% of internet traffic has come from search engines.",
    longDescription:
      "SEO Company in Chandigarh– What comes to your mind when you heard the term Search Engine Optimization or SEO (want to rank #1 on any search engine). The most popular search engine is GOOGLE, as we all depend on our daily life’s. By keeping an eye on the latest algorithms we provide thebest SEO services in Chandigarh, India. SEOservices help the business to get a high amount of relevant traffic to their websites without spending more money. It has been proven that more than 80% of internet traffic has come from search engines. Are you looking to have the best in classSEO servicesfrom thetopSEO company in Chandigarh,India? If yes, then you are in the right place. We at Creative Monk have always believed in offering our clients the best SEO services in Chandigarh, India and across the world. With more than a half-decade of experience in search engine optimization, Creative Monk is one of thebest SEO companies in Chandigarh.Search EngineOptimizationis one of the most effective ways to generate organic traffic through search engines to your website. At Creative Monk –SEO Company in Chandigarh, we provide the bestSEOsolutions to clients of any domain. We help our clients grow their business by attracting customers through search engines by optimizing their websites to appear on the first page of the SERPs.",
    features: [
      "Technical SEO Audits",
      "Keyword Research & Strategy",
      "On-Page SEO Optimization",
      "Authority Link Building",
      "Local SEO Optimization",
      "Schema Markup Implementation",
    ],
    process: [
      { step: "Audit", desc: "Deep-dive technical analysis of your site." },
      { step: "Strategy", desc: "Mapping commercial intent keywords." },
      { step: "Optimization", desc: "Fixing architecture and on-page elements." },
      { step: "Authority", desc: "Building high-quality backlinks." },
      { step: "Scale", desc: "Continuous monitoring and content scaling." },
    ],
    outcomes: [
      "300% traffic increase",
      "Page 1 keyword dominance",
      "Reduced cost per acquisition",
      "Sustainable organic growth",
    ],
    faqs: [
      { question: "When will I see SEO results?", answer: "Usually within 3 to 6 months for significant ranking improvements. SEO is a long-term investment." },
      { question: "Are your SEO practices safe?", answer: "Yes, we follow 100% white-hat techniques recommended by Google." },
      { question: "Do you guarantee page 1 rankings?", answer: "No ethical SEO agency can guarantee specific rankings. However, we consistently deliver page 1 results for our clients." },
    ],
    icon: Search,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    category: "marketing",
  },
  {
    slug: "social-media-marketing",
    title: "Social Media Marketing",
    shortTitle: "SMM",
    tagline: "Turn scrollers into fiercely loyal customers.",
    description:
      "Social Media Marketing Company in Chandigarh– Having a strong social media presence on the web for your business is the key to successful companies in these modern times. Trying to keep up with your customers on the ever-growing numbers on social media platforms can be very demanding and also an intensive task. Having a social media campaign that is successful is very extensive and time-consuming. From checking and replying to loads of public and private messages, creating well-written content for each social media platform & dealing with public relations issues, your brands need it all. Due to this, many businesses shy away from making use and leveraging social media despite the significant marketing benefits it has. Ready to work with the best digital and social media marketing company? Contact usBest Social Media Marketing Company in Chandigarh.",
    longDescription:
      "Social Media Marketing Company in Chandigarh– Having a strong social media presence on the web for your business is the key to successful companies in these modern times. Trying to keep up with your customers on the ever-growing numbers on social media platforms can be very demanding and also an intensive task. Having a social media campaign that is successful is very extensive and time-consuming. From checking and replying to loads of public and private messages, creating well-written content for each social media platform & dealing with public relations issues, your brands need it all. Due to this, many businesses shy away from making use and leveraging social media despite the significant marketing benefits it has. Ready to work with the best digital and social media marketing company? Contact usBest Social Media Marketing Company in Chandigarh. Let Us cater to all your Digital Needs Under one Roof and help you skyrocket lead generation and branding efforts for your business.",
    features: [
      "Social Media Strategy",
      "Content Creation & Scheduling",
      "Paid Social Advertising",
      "Community Management",
      "Influencer Marketing",
      "Analytics & Reporting",
    ],
    process: [
      { step: "Audit", desc: "Analyzing your current social media presence." },
      { step: "Strategy", desc: "Developing content pillars and brand voice." },
      { step: "Creation", desc: "Producing engaging content and creatives." },
      { step: "Distribution", desc: "Strategic posting and ad management." },
      { step: "Optimization", desc: "Iterating based on performance data." },
    ],
    outcomes: [
      "5x audience growth",
      "Higher engagement rates",
      "Direct lead generation",
      "Strong brand loyalty",
    ],
    faqs: [
      { question: "Which platforms do you manage?", answer: "We manage Facebook, Instagram, LinkedIn, YouTube, Twitter, and Pinterest based on where your audience is." },
      { question: "Do you create the content?", answer: "Yes, our in-house team creates all graphics, copy, and video content." },
    ],
    icon: Share2,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
    category: "marketing",
  },
  {
    slug: "sem",
    title: "Search Engine Marketing",
    shortTitle: "SEM",
    tagline: "Instant visibility on Google when it matters most.",
    description:
      "Search Engine Marketing(SEM) has become extensively important for an internet business to attain millions of people in promoting your business, products or services.Creative Monkis a professionalSearch Engine Marketing CompanyinChandigarhhas an absolute solution in the procedure of creating many websites and web applications. Therefore, other than designing and developing websites, we also offer a wide range of services in Digital Marketing.Search Engine Marketing Company servicesis a kind ofinternet marketingwhich engross in marketing or promoting your web portal or web application. It is the technique of attaining traffic and visibility from various search engine pages through thepaid services.",
    longDescription:
      "Search Engine Marketing(SEM) has become extensively important for an internet business to attain millions of people in promoting your business, products or services.Creative Monkis a professionalSearch Engine Marketing CompanyinChandigarhhas an absolute solution in the procedure of creating many websites and web applications. Therefore, other than designing and developing websites, we also offer a wide range of services in Digital Marketing.Search Engine Marketing Company servicesis a kind ofinternet marketingwhich engross in marketing or promoting your web portal or web application. It is the technique of attaining traffic and visibility from various search engine pages through thepaid services. SEM is a part of the digital market, and digital marketing is becoming an important part of website marketing or web advertising.",
    features: [
      "Google Ads Management",
      "Keyword Research & Bidding",
      "Ad Copywriting",
      "Landing Page Optimization",
      "Conversion Tracking",
      "A/B Testing",
    ],
    process: [
      { step: "Research", desc: "Identifying high-intent keywords and competitors." },
      { step: "Setup", desc: "Creating campaign structure and ad groups." },
      { step: "Creative", desc: "Writing compelling ad copy and extensions." },
      { step: "Launch", desc: "Deploying campaigns with tracking." },
      { step: "Optimize", desc: "Continuous bid and budget optimization." },
    ],
    outcomes: [
      "Immediate visibility",
      "Higher quality score",
      "Lower cost per click",
      "Maximized ROI",
    ],
    faqs: [
      { question: "How much should I spend on Google Ads?", answer: "Budget depends on your industry and goals. We recommend starting with ₹15,000-30,000/month and scaling based on results." },
      { question: "How quickly will I see results?", answer: "SEM delivers results immediately once campaigns go live, unlike SEO which takes months." },
    ],
    icon: Megaphone,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    category: "marketing",
  },
  {
    slug: "ppc",
    title: "Pay Per Click Advertising",
    shortTitle: "PPC",
    tagline: "Every click counts. Every rupee optimized.",
    description:
      "PPC Company in Chandigarh– We are a pioneering agency providingPPC services in Chandigarh. Whether it is via Google Ad Words, Facebook or Bing ads, we aim to understand your vision and provide you with a clear solution. We recognize the uniqueness of all the companies.Creative Monkis theBest PPC Company in Chandigarhknown for their hard work and dedication towards making their customers business successful by delivering high ROI(Return Of Investment) through constant monitoring, optimizing of keywords and improving strategies.",
    longDescription:
      "PPC Company in Chandigarh– We are a pioneering agency providingPPC services in Chandigarh. Whether it is via Google Ad Words, Facebook or Bing ads, we aim to understand your vision and provide you with a clear solution. We recognize the uniqueness of all the companies.Creative Monkis theBest PPC Company in Chandigarhknown for their hard work and dedication towards making their customers business successful by delivering high ROI(Return Of Investment) through constant monitoring, optimizing of keywords and improving strategies. PPCis known asPay Per Clickor searches engine marketing (SEM). In PPC advertising, you get to pay only when the user clicks on your ad. Our team of certified PPC professionals work on planning and implementation of the campaign to target your buyer persona. In PPC advertising we have the freedom to select as many keywords as we want to show our advertisements. In most scenarios, PPC results can be visible in a few days.",
    features: [
      "Google Ads (Search, Display, Shopping)",
      "Facebook & Instagram Ads",
      "LinkedIn Advertising",
      "Remarketing Campaigns",
      "Conversion Rate Optimization",
      "Monthly Performance Reports",
    ],
    process: [
      { step: "Audit", desc: "Reviewing current ad performance and opportunities." },
      { step: "Strategy", desc: "Defining target audience and budget allocation." },
      { step: "Creation", desc: "Designing ads and landing pages." },
      { step: "Management", desc: "Daily monitoring and bid optimization." },
      { step: "Reporting", desc: "Transparent monthly performance reports." },
    ],
    outcomes: [
      "Lower cost per lead",
      "Higher click-through rates",
      "Better quality scores",
      "Transparent ROI tracking",
    ],
    faqs: [
      { question: "What is PPC?", answer: "PPC (Pay Per Click) is an advertising model where you pay only when someone clicks on your ad. It includes Google Ads, Facebook Ads, and more." },
      { question: "Can PPC work for small businesses?", answer: "Absolutely! PPC is scalable and works with any budget. We help small businesses compete effectively." },
    ],
    icon: MousePointerClick,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    category: "marketing",
  },
  {
    slug: "local-business-marketing",
    title: "Local Business Marketing",
    shortTitle: "Local Marketing",
    tagline: "Dominate your local market. Be found first.",
    description:
      "Local Business marketingis a crucial side of a successful, comprehensive Internet marketing strategy. For the business with multiple locations or the corporation seeking additional local customers, a traditional approach to SEO won’t be enough; in reality, marketing to a targeted local audience requires its own unique set of strategies. When it (local business marketing) done correctly, local online marketing allows businesses to improve their branding, positively engage with their community, increase customer loyalty and secure higher conversion rates.",
    longDescription:
      "Local Business marketingis a crucial side of a successful, comprehensive Internet marketing strategy. For the business with multiple locations or the corporation seeking additional local customers, a traditional approach to SEO won’t be enough; in reality, marketing to a targeted local audience requires its own unique set of strategies. When it (local business marketing) done correctly, local online marketing allows businesses to improve their branding, positively engage with their community, increase customer loyalty and secure higher conversion rates. The following chart is a summary of every local marketing technique and we dive into each category in detail below.",
    features: [
      "Google My Business Optimization",
      "Local SEO & Citations",
      "Review Management",
      "Local Directory Listings",
      "Geo-Targeted Ads",
      "Map Pack Optimization",
    ],
    process: [
      { step: "Audit", desc: "Analyzing your local search presence." },
      { step: "Optimize", desc: "Setting up and optimizing Google My Business." },
      { step: "Citations", desc: "Building consistent local directory listings." },
      { step: "Reviews", desc: "Implementing review generation strategy." },
      { step: "Ads", desc: "Running geo-targeted local campaigns." },
    ],
    outcomes: [
      "Top 3 map pack rankings",
      "More walk-in customers",
      "Higher review ratings",
      "Increased local visibility",
    ],
    faqs: [
      { question: "What is local SEO?", answer: "Local SEO focuses on optimizing your online presence to attract customers from your specific geographic area, especially through Google Maps." },
      { question: "How important are Google reviews?", answer: "Very important! Reviews directly impact your local search rankings and customer trust." },
    ],
    icon: Target,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop",
    category: "marketing",
  },
  {
    slug: "lead-generation",
    title: "Lead Generation Services",
    shortTitle: "Lead Generation",
    tagline: "Fill your sales pipeline with qualified leads.",
    description:
      "Lead generationis the major element of the sales cycle of your business. To do this productively, you need to hire a digital marketing agency that carefully analyses and track your market. Engaging decision-makers with your digital strategy within the centered market can lucratively increase your sales results. A new way of doing an effective buying process is through lead generation. Creative Monk believes in generating leads by discovering various ways to driving your business at targeted demographics.",
    longDescription:
      "Lead generationis the major element of the sales cycle of your business. To do this productively, you need to hire a digital marketing agency that carefully analyses and track your market. Engaging decision-makers with your digital strategy within the centered market can lucratively increase your sales results. A new way of doing an effective buying process is through lead generation. Creative Monk believes in generating leads by discovering various ways to driving your business at targeted demographics. Lead generation in terms of digital marketing directs to the generation of potential clients or customers interest for your products and services. Furthermore, it can be availed in two perspectives from the digital marketing providers, namely‘Sales Leads’ & ‘Marketing Leads’. Targeting the right audience is the ultimate key to the generation of both these leads.",
    features: [
      "Landing Page Design",
      "Lead Magnet Creation",
      "Email Marketing Funnels",
      "Remarketing Campaigns",
      "CRM Integration",
      "Lead Scoring & Qualification",
    ],
    process: [
      { step: "Define", desc: "Identifying your ideal customer profile." },
      { step: "Build", desc: "Creating lead capture pages and forms." },
      { step: "Drive", desc: "Running targeted traffic campaigns." },
      { step: "Nurture", desc: "Setting up email sequences and follow-ups." },
      { step: "Optimize", desc: "Analyzing and improving conversion rates." },
    ],
    outcomes: [
      "Predictable lead flow",
      "Lower cost per lead",
      "Higher lead quality",
      "Automated follow-ups",
    ],
    faqs: [
      { question: "What kind of leads will I get?", answer: "We target leads based on your ideal customer profile — demographics, interests, and buying intent." },
      { question: "How do you capture leads?", answer: "Through optimized landing pages, lead magnets, forms, chatbots, and strategic CTAs across your digital presence." },
    ],
    icon: Target,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop",
    category: "marketing",
  },
  {
    slug: "cro",
    title: "Conversion Rate Optimization",
    shortTitle: "CRO",
    tagline: "Convert more visitors into customers.",
    description:
      "In Digital marketing, conversion optimization, or conversion rate optimization (CRO) is a system for increasing the percentage of visitors to a website that converts into customers, or more generally, takes any desired action on a webpage.",
    longDescription:
      "In Digital marketing, conversion optimization, or conversion rate optimization (CRO) is a system for increasing the percentage of visitors to a website that converts into customers, or more generally, takes any desired action on a webpage. Conversion rate optimization (CRO) is the process of optimizing your sponsored search ads, landing pages, and overall website design to raise your conversion rate.",
    features: [
      "Conversion Audit & Analysis",
      "A/B & Multivariate Testing",
      "Heatmap & User Recording Analysis",
      "UX/UI Improvements",
      "Landing Page Optimization",
      "Checkout Flow Optimization",
    ],
    process: [
      { step: "Analyze", desc: "Mapping current conversion funnels." },
      { step: "Hypothesize", desc: "Identifying optimization opportunities." },
      { step: "Test", desc: "Running controlled A/B experiments." },
      { step: "Implement", desc: "Deploying winning variations." },
      { step: "Repeat", desc: "Continuous testing and improvement." },
    ],
    outcomes: [
      "Higher conversion rates",
      "Better user experience",
      "Increased revenue per visitor",
      "Data-driven decisions",
    ],
    faqs: [
      { question: "What is CRO?", answer: "Conversion Rate Optimization is the process of improving your website to increase the percentage of visitors who take a desired action (purchase, sign up, contact)." },
      { question: "How much can CRO improve conversions?", answer: "Typically 20-50% improvement in conversion rates through systematic testing and optimization." },
    ],
    icon: TrendingUp,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    category: "marketing",
  },
  {
    slug: "social-media-management",
    title: "Social Media Management",
    shortTitle: "Social Management",
    tagline: "Your brand, managed professionally across all platforms.",
    description:
      "Social Media Management Services– Social media management is the process of creating, scheduling, analyzing, and engaging with content posted on social media platforms, like Facebook, Instagram, and Twitter.",
    longDescription:
      "Social Media Management Services– Social media management is the process of creating, scheduling, analyzing, and engaging with content posted on social media platforms, like Facebook, Instagram, and Twitter. Oursocial media management servicesinChandigarhis a part of the overall strategy and hands-on methodologies that we provide our clients to expose their services and products. You know that you need to have a strong presence on social media, it’s where all your customers hang out. You perceive its importance and the potential it packs in terms of bringing new business and increasing brand awareness.",
    features: [
      "Content Calendar Planning",
      "Graphic & Video Content Creation",
      "Daily Posting & Scheduling",
      "Community Management",
      "Reply & DM Management",
      "Monthly Analytics Reports",
    ],
    process: [
      { step: "Strategy", desc: "Developing brand voice and content pillars." },
      { step: "Calendar", desc: "Planning monthly content calendar." },
      { step: "Create", desc: "Producing graphics, copy, and videos." },
      { step: "Publish", desc: "Scheduling and posting at optimal times." },
      { step: "Engage", desc: "Managing comments, DMs, and community." },
    ],
    outcomes: [
      "Consistent brand presence",
      "Higher engagement rates",
      "Growing follower base",
      "Professional brand image",
    ],
    faqs: [
      { question: "How many posts per week?", answer: "Our standard plans include 3-5 posts per week per platform, with stories and reels as needed." },
      { question: "Do you respond to comments?", answer: "Yes, community management is included. We respond to comments, DMs, and mentions on your behalf." },
    ],
    icon: Users,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
    category: "marketing",
  },

  // ════════════════════════════════════════════════════════════════════
  // GRAPHIC DESIGNING
  // ════════════════════════════════════════════════════════════════════
  {
    slug: "logo-designing",
    title: "Logo Designing",
    shortTitle: "Logo Design",
    tagline: "A logo that tells your story at a glance.",
    description:
      "Get a unique, professional logo that represents your brand identity and makes a lasting impression.",
    longDescription:
      "Your logo is the face of your brand. At Creative Monk, we design logos that are unique, versatile, and memorable. Our design process involves deep research into your brand values, target audience, and industry to create a logo that perfectly represents who you are. We provide multiple concepts and revisions until you're 100% satisfied.",
    features: [
      "Multiple Logo Concepts",
      "Unlimited Revisions",
      "Brand Color Palette",
      "Typography Selection",
      "Source Files (AI, EPS, PNG, SVG)",
      "Brand Usage Guidelines",
    ],
    process: [
      { step: "Brief", desc: "Understanding your brand, values, and vision." },
      { step: "Research", desc: "Analyzing competitors and industry trends." },
      { step: "Concepts", desc: "Creating multiple unique logo concepts." },
      { step: "Refine", desc: "Iterating based on your feedback." },
      { step: "Deliver", desc: "Final files in all formats with guidelines." },
    ],
    outcomes: [
      "Unique brand mark",
      "Professional identity",
      "Versatile logo system",
      "Complete brand guidelines",
    ],
    faqs: [
      { question: "How many logo concepts will I get?", answer: "We provide 3-5 unique logo concepts to choose from, with unlimited revisions on your selected concept." },
      { question: "Do I get the source files?", answer: "Yes, you receive all source files including AI, EPS, SVG, and high-resolution PNG formats." },
    ],
    icon: PenTool,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop",
    category: "design",
  },
  {
    slug: "package-designing",
    title: "Package Designing",
    shortTitle: "Packaging",
    tagline: "Packaging that stands out on every shelf.",
    description:
      "“Package Design” plays an important role in attracting prospective customers and converting the mere-lookers into buyers and increasing sales. Without a good design for all your packaged products, it may not be easy to propel customers more towards buying. In fact, even a minor flaw can lead to negative effects and may ruin all your other inter-connected marketing processes.",
    longDescription:
      "“Package Design” plays an important role in attracting prospective customers and converting the mere-lookers into buyers and increasing sales. Without a good design for all your packaged products, it may not be easy to propel customers more towards buying. In fact, even a minor flaw can lead to negative effects and may ruin all your other inter-connected marketing processes. Remember, explicitly beautiful package design is the reflection of your own brand. Therefore, do not just take it for granted.",
    features: [
      "Product Packaging Design",
      "Label Design",
      "Box & Container Design",
      "Dieline & Print-Ready Files",
      "3D Mockups",
      "Material Guidance",
    ],
    process: [
      { step: "Brief", desc: "Understanding product and target market." },
      { step: "Research", desc: "Analyzing competitor packaging." },
      { step: "Design", desc: "Creating packaging concepts." },
      { step: "3D Mockup", desc: "Visualizing designs in 3D." },
      { step: "Print-Ready", desc: "Preparing files for production." },
    ],
    outcomes: [
      "Shelf-stopping design",
      "Brand consistency",
      "Print-ready files",
      "Higher perceived value",
    ],
    faqs: [
      { question: "Do you handle printing too?", answer: "We design the packaging and provide print-ready files. We can also recommend trusted printing partners." },
      { question: "Can you create 3D mockups?", answer: "Yes, we create realistic 3D mockups so you can visualize your packaging before printing." },
    ],
    icon: Package,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop",
    category: "design",
  },
  {
    slug: "corporate-designing",
    title: "Corporate Designing",
    shortTitle: "Corporate Design",
    tagline: "Professional corporate identity that builds trust.",
    description:
      "In stationery designing, we work on the complete branding or creation of a visual identity of the company that includes visiting cards, continuous office supplies, letterheads, writing material, business cards, etc. This type of designing is most important for any enterprise. It reaches not only to the hands of the existing clients of the company but to the new prospects as well.",
    longDescription:
      "In stationery designing, we work on the complete branding or creation of a visual identity of the company that includes visiting cards, continuous office supplies, letterheads, writing material, business cards, etc. This type of designing is most important for any enterprise. It reaches not only to the hands of the existing clients of the company but to the new prospects as well. Nowadays everyone understands the significance that business stationery plays an important role in a corporate. There are a number of elements of business stationery design which is to be used within an office and outside. However, the three most frequently used items, namely, the business card, envelope, and letterhead.",
    features: [
      "Business Card Design",
      "Letterhead & Envelope Design",
      "Presentation Templates",
      "Email Signature Design",
      "Company Profile Design",
      "ID Card & Certificate Design",
    ],
    process: [
      { step: "Brand Review", desc: "Reviewing existing brand elements." },
      { step: "Design", desc: "Creating corporate identity materials." },
      { step: "Feedback", desc: "Incorporating your revisions." },
      { step: "Finalize", desc: "Preparing all materials for print and digital." },
      { step: "Deliver", desc: "Handing over all files and guidelines." },
    ],
    outcomes: [
      "Professional brand image",
      "Consistent identity",
      "Trust-building collaterals",
      "Ready-to-use templates",
    ],
    faqs: [
      { question: "What's included in corporate identity?", answer: "Typically: business cards, letterhead, envelope, email signature, presentation template, and company profile design." },
      { question: "Can you match our existing brand?", answer: "Absolutely! We work with your existing logo and brand guidelines to ensure perfect consistency." },
    ],
    icon: Palette,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop",
    category: "design",
  },
  {
    slug: "social-media-posters",
    title: "Social Media Poster Design",
    shortTitle: "Social Posters",
    tagline: "Scroll-stopping social media creatives.",
    description:
      "Social media is more popular than ever and we will help your business to get the most out of your online presence. You’re a busy businessman, owner or a new to business while you know social media is important, you just don’t have the time to put in. Branded and Original social media images will help your business through different things like, increase website traffic, increase visibility, and increase that “Awesome” factor necessary to grow a business.",
    longDescription:
      "Social media is more popular than ever and we will help your business to get the most out of your online presence. You’re a busy businessman, owner or a new to business while you know social media is important, you just don’t have the time to put in. Branded and Original social media images will help your business through different things like, increase website traffic, increase visibility, and increase that “Awesome” factor necessary to grow a business. The type of graphics your brand shares over social media is largely dictated by your audience and the kind of image you want to portray. For some brands, curating stock images, self-editing or producing graphics can work perfectly well.",
    features: [
      "Instagram Post & Story Design",
      "Facebook Cover & Post Design",
      "LinkedIn Graphics",
      "Festival & Event Creatives",
      "Promotional Graphics",
      "Carousel Post Design",
    ],
    process: [
      { step: "Brief", desc: "Understanding brand and content needs." },
      { step: "Concept", desc: "Creating design themes and templates." },
      { step: "Design", desc: "Producing individual post designs." },
      { step: "Review", desc: "Getting your approval and feedback." },
      { step: "Deliver", desc: "Ready-to-post files in all sizes." },
    ],
    outcomes: [
      "Higher engagement rates",
      "Consistent visual identity",
      "Professional social presence",
      "More shares and saves",
    ],
    faqs: [
      { question: "How many designs per month?", answer: "Our packages range from 15-30 designs per month, including posts, stories, and special occasion creatives." },
      { question: "Do you provide content calendar too?", answer: "Yes, we can plan a content calendar with suggested topics and posting schedule." },
    ],
    icon: ImageIcon,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
    category: "design",
  },
  {
    slug: "banner-designing",
    title: "Banner Designing",
    shortTitle: "Banners",
    tagline: "Banners that grab attention and drive action.",
    description:
      "Are you searching for a communicating approach to boost your sales?Banner Designing Companyin ChandigarhfromCreative Monkis the seamless mode to connect with your prospective patrons and enhance the responsive charges.",
    longDescription:
      "Are you searching for a communicating approach to boost your sales?Banner Designing Companyin ChandigarhfromCreative Monkis the seamless mode to connect with your prospective patrons and enhance the responsive charges. Do you want that your consumers have to be only a click away from being up-to-date with your state-of-the-art products and services? Are you seeking out a professional tool that can help you in branding, aiming traffic and growing would-be regulars? Convey your business message across throughbanner designfromCreative Monk, and align yourselves with the constantly budding requirements of customers.",
    features: [
      "Web Banner Design",
      "Google Display Ad Banners",
      "Social Media Ad Banners",
      "Roll-Up & Standee Design",
      "Billboard & Hoarding Design",
      "Event & Trade Show Banners",
    ],
    process: [
      { step: "Brief", desc: "Understanding the purpose and placement." },
      { step: "Concept", desc: "Creating design concepts." },
      { step: "Design", desc: "Producing banners in required sizes." },
      { step: "Optimize", desc: "File optimization for web or print." },
      { step: "Deliver", desc: "All sizes and formats delivered." },
    ],
    outcomes: [
      "Higher click-through rates",
      "Professional brand image",
      "Consistent messaging",
      "Multi-format delivery",
    ],
    faqs: [
      { question: "What banner sizes do you design?", answer: "We design banners in all standard sizes — leaderboard, skyscraper, rectangle, and custom sizes for any platform." },
      { question: "Do you design for print too?", answer: "Yes, we design roll-ups, standees, hoardings, and all large format print materials." },
    ],
    icon: LayoutTemplate,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop",
    category: "design",
  },
  {
    slug: "branding",
    title: "Branding",
    shortTitle: "Branding",
    tagline: "Building Digital Legacies through Strategic Identity.",
    description:
      "Holistic brand strategy that defines your market position, voice, and digital impact.",
    longDescription:
      "At Creative Monk, we believe branding is more than just a logo—it's the soul of your business. Our branding services encompass deep market research, strategic positioning, and a cohesive brand voice that resonates with your target audience. We build digital legacies by ensuring every touchpoint of your brand communicates authority, trust, and premium quality. From brand discovery to a full-scale digital presence launch, we provide the strategic framework needed to dominate your industry.",
    features: [
      "Brand Discovery & Strategy",
      "Market Positioning Analysis",
      "Messaging & Voice Framework",
      "Digital Presence Launch Strategy",
      "Comprehensive Brand Style Guides",
      "Brand Archetype Definition",
    ],
    process: [
      { step: "Discovery", desc: "Deep dive into your business values, goals, and audience." },
      { step: "Strategy", desc: "Defining your unique market positioning and brand voice." },
      { step: "Visual Identity", desc: "Crafting the visual language that supports the strategy." },
      { step: "Guidelines", desc: "Creating detailed brand books for consistent implementation." },
      { step: "Launch", desc: "Introducing your refreshed brand to the market." },
    ],
    outcomes: [
      "Clear market positioning",
      "Unified brand voice",
      "Stronger customer loyalty",
      "Premium brand perception",
    ],
    faqs: [
      { question: "Why is branding important for my business?", answer: "Branding helps you stand out in a crowded market, builds trust with your audience, and allows you to command premium pricing by increasing your perceived value." },
      { question: "How long does a full branding project take?", answer: "A comprehensive branding project typically takes 4-8 weeks, depending on the scope of the strategy and visual assets required." },
    ],
    icon: Sparkles,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop",
    category: "marketing",
  },
  {
    slug: "print-design",
    title: "Print Design",
    shortTitle: "Print Design",
    tagline: "Tangible Design for the Real World.",
    description:
      "High-quality print media from business cards to brochures that speak volumes about your professionalism.",
    longDescription:
      "In a digital world, high-quality print design makes your brand tangible and trustworthy. Creative Monk provides professional print design services in Chandigarh, India, ranging from luxury business cards and corporate brochures to high-impact billboards and magazine ads. Our designs are optimized for production, ensuring that colors are vibrant and typography is crisp. We bridge the gap between digital strategy and physical presence, giving your brand a professional edge in the real world.",
    features: [
      "Brochures & Flyers",
      "Luxury Business Cards",
      "Stationery & Letterheads",
      "Billboard & Outdoor Signage",
      "Magazine & Newspaper Ads",
      "Company Profiles & Annual Reports",
    ],
    process: [
      { step: "Brief", desc: "Gathering requirements, dimensions, and brand constraints." },
      { step: "Design", desc: "Creating high-impact print-ready layouts." },
      { step: "Review", desc: "Refining designs based on your feedback." },
      { step: "Pre-press", desc: "Preparing files with bleed and crop marks." },
      { step: "Delivery", desc: "Sending high-resolution files to your printer." },
    ],
    outcomes: [
      "Professional physical presence",
      "High-quality print assets",
      "Brand consistency across media",
      "Tangible marketing impact",
    ],
    faqs: [
      { question: "Do you handle the actual printing?", answer: "We provide the print-ready files optimized for production. We can also coordinate with your printer or recommend our trusted partners." },
      { question: "What file formats will I receive?", answer: "You will receive high-resolution PDFs with bleed marks, along with editable source files in AI or Indesign formats." },
    ],
    icon: Package,
    color: "#FF6600",
    image: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?q=80&w=1932&auto=format&fit=crop",
    category: "design",
  },
];

// ─── Helper Functions ──────────────────────────────────────────────
export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServicesByCategory(category: "web" | "marketing" | "design"): ServiceDetail[] {
  return services.filter((s) => s.category === category);
}

export function getAllServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}

// Also provide category slug pages
export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return serviceCategories.find((c) => c.slug === slug);
}
