import type { CreditPack } from '@/lib/pricing';
import type { Locale } from './config';

// DeepWiden 把默认语言包的字面量类型放宽，方便其他语言复用同一结构。
type DeepWiden<T> = T extends string ? string : T extends number ? number : T extends readonly (infer Item)[] ? DeepWiden<Item>[] : T extends object ? { [Key in keyof T]: DeepWiden<T[Key]> } : T;

// englishDictionary 是默认语言包，也是其他语言包的结构基准。
const englishDictionary = {
  common: {
    siteName: 'Remove Matcha Filter',
    tagline: 'AI natural photo recovery',
    ogAlt: 'Remove Matcha Filter before and after preview',
    nav: {
      remove: 'Remove',
      pricing: 'Pricing',
      myImages: 'My Images',
      blog: 'Blog',
      faq: 'FAQ'
    },
    auth: {
      checking: 'Checking login...',
      signIn: 'Sign In',
      signOut: 'Sign out',
      signOutWithName: 'Sign out · {name}'
    },
    language: {
      label: 'Language',
      button: 'Language',
      menu: 'Choose language'
    },
    mobileMenu: {
      menu: 'Menu',
      open: 'Open navigation menu',
      close: 'Close navigation menu'
    },
    footer: {
      brand: 'Remove Matcha Filter · AI natural photo recovery',
      privacy: 'Privacy',
      terms: 'Terms',
      refund: 'Refund',
      contact: 'Contact:',
      tools: 'Tools',
      legal: 'Legal',
      tiktok: 'TikTok Remove Matcha Filter',
      youtube: 'YouTube Remove Matcha Filter'
    }
  },
  metadata: {
    home: {
      title: 'Remove Matcha Filter from Photos Online',
      description: 'Remove matcha filter, green tint, yellow cast, and muted color from photos online. Preview a free cleanup, then use AI Restore for natural results.'
    },
    upload: {
      title: 'Matcha Filter Remover Online',
      description: 'Upload a photo, preview a free cleanup, and use AI Restore when you need stronger matcha filter removal.'
    },
    pricing: {
      title: 'Pricing | Remove Matcha Filter',
      description: 'Buy credits only when you need AI Restore. No subscription, free preview first, and failed jobs return the used credit.'
    },
    faq: {
      title: 'FAQ | Remove Matcha Filter',
      description: 'Answers about matcha filter removal, free preview, AI Restore credits, image privacy, supported formats, and refunds.'
    },
    blog: {
      title: 'Matcha Filter Blog: Guides and Photo Cleanup Tips',
      description: 'Read guides about matcha filters, green tint, yellow cast, free browser processing, and AI Restore for natural photo cleanup.'
    },
    whatIs: {
      title: 'What Is a Matcha Filter? Green Tint Photo Filter Explained',
      description: 'Learn what a matcha-style filter means, why photos look green or yellow, and when a matcha filter remover can help.'
    },
    howTo: {
      title: 'How to Remove Matcha Filter from a Photo Online',
      description: 'Follow a simple workflow to remove matcha filter from photo online: upload, preview free cleanup, then use AI Restore if needed.'
    },
    tiktok: {
      title: 'TikTok Remove Matcha Filter – Clean TikTok Photos Online',
      description: 'Remove matcha filter from TikTok screenshots and saved photos. Free browser preview, then AI Restore for natural results.'
    },
    youtube: {
      title: 'YouTube Remove Matcha Filter – Clean YouTube Thumbnails & Screenshots',
      description: 'Remove matcha filter from YouTube thumbnails, screenshots, and saved photos. Free browser preview, then AI Restore for natural results.'
    },
    privacy: {
      title: 'Privacy Policy | Remove Matcha Filter',
      description: 'Learn how Remove Matcha Filter handles uploads, AI Restore jobs, account data, payments, analytics, and feedback.'
    },
    terms: {
      title: 'Terms of Service | Remove Matcha Filter',
      description: 'Read the terms for using Remove Matcha Filter, AI Restore credits, permitted uploads, refunds, and service limitations.'
    },
    refund: {
      title: 'Refund Policy | Remove Matcha Filter',
      description: 'Understand refunds, failed AI Restore jobs, credit returns, unused paid credits, and how to contact support.'
    },
    myImages: {
      title: 'My Images | Remove Matcha Filter',
      description: 'View private AI Restore results saved to your signed-in account.'
    }
  },
  home: {
    heroPills: ['JPG / PNG / WEBP', 'Process free in browser', 'AI Restore uses 1 credit'],
    proofMetrics: [
      { value: '3-step', label: 'upload to download flow' },
      { value: '1 credit', label: 'per AI Restore attempt' },
      { value: '0 promise', label: 'of fake original pixels' }
    ],
    steps: [
      { title: 'Upload', text: 'Choose one JPG, PNG, or WEBP photo with a visible matcha-style cast.' },
      { title: 'Preview', text: 'Check the free browser cleanup before deciding whether AI needs to go further.' },
      { title: 'AI Restore', text: 'Use 1 credit for stronger green tint and yellow cast reduction.' }
    ],
    resultFeatures: [
      { title: 'Before / After', text: 'Check how much green or yellow cast was reduced.' },
      { title: 'Natural balance', text: 'Judge the output by believable color, not pixel-perfect reconstruction.' },
      { title: 'Download ready', text: 'Save the restored image when the result looks right.' }
    ],
    faqs: [
      { question: 'What is a matcha filter?', answer: 'A matcha filter is a green, yellow, or muted aesthetic color cast that can make skin, whites, food, interiors, and backgrounds look less natural.' },
      { question: 'Can you completely remove a matcha filter from a saved photo?', answer: 'Not perfectly. Once a filter is baked into an exported image, the original pixels are gone. The tool can reduce the cast and create a more natural-looking version, but it cannot prove the exact original.' },
      { question: 'What kinds of photos work best?', answer: 'Clear JPG, PNG, or WEBP photos with visible green or yellow tint usually work best. Heavy blur, low light, strong compression, or extreme edits can limit the result.' },
      { question: 'Does it work on Instagram, TikTok, Snapchat, or Lightroom-style filters?', answer: 'It can help with many saved photos that have a green, yellow, vintage, or matcha-style color cast. It is not designed to remove stickers, AR face changes, text overlays, or beauty reshaping.' },
      { question: 'Will skin tones stay natural?', answer: 'The AI Restore prompt is designed to prioritize believable skin tones and neutral whites. For portraits, use the skin tone priority option if the face still looks green, yellow, gray, or waxy.' },
      { question: 'Can it fix yellow warmth or green indoor lighting?', answer: 'Yes, it can be useful for photos affected by warm lighting, green walls, tinted windows, or aesthetic presets. Stronger white balance can help when whites and grays still look tinted.' },
      { question: 'Do I need photo editing skills?', answer: 'No manual masking is required for the main flow. Upload one image, choose a restore strength and white balance level, then create an AI Restore attempt.' },
      { question: 'What formats and size can I upload?', answer: 'The upload flow accepts JPG, PNG, and WEBP images up to 10MB.' },
      { question: 'How do credits work?', answer: 'There is no subscription. Selecting and previewing your local image is free. Creating an AI Restore job uses 1 credit, and unused paid credits are valid for 12 months.' },
      { question: 'Can I use it to reveal hidden or private content?', answer: "No. Only upload photos you own or have permission to edit. Do not use the tool to expose, identify, or reconstruct private content, hidden body details, or someone else's sensitive image." }
    ],
    hero: {
      eyebrow: 'Remove Matcha Filter',
      title: 'Remove Matcha Filter from Your Photo',
      description: 'Upload a photo and let AI reduce greenish, yellowish, or matcha-style color casts while keeping the result natural.',
      primaryCta: 'Upload a photo',
      secondaryCta: 'View credits',
      restoreLabel: 'AI Restore',
      restoreText: 'Stronger tint reduction when the photo still looks too green.'
    },
    result: {
      eyebrow: 'Result preview',
      title: 'Compare the color recovery before you download.',
      description: 'Results should be judged by natural color balance, not by a promise to recreate the untouched original file.'
    },
    how: {
      eyebrow: 'How it works',
      title: 'Three steps from cast to balance.',
      description: 'A focused flow for one photo at a time, built around visible before and after decisions.'
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Know the limits before you upload.'
    }
  },
  upload: {
    top: { back: 'Back to home', badge: 'Matcha filter remover' },
    guidanceSteps: [
      { title: 'Upload', text: 'Drop one photo with a visible matcha-style green or yellow cast.' },
      { title: 'Preview', text: 'Run the free preview before spending a credit.' },
      { title: 'Restore', text: 'Use AI Restore when the image still needs stronger cast reduction.' }
    ],
    intro: {
      eyebrow: 'Photo cleanup workflow',
      title: 'Upload, preview, then restore.',
      description: 'Start with a free preview. If the photo still has a green or yellow cast, use AI Restore with 1 credit for a stronger natural result.',
      pills: ['Free preview first', '1 credit for AI Restore', 'Natural result, not exact original'],
      footer: 'JPG, PNG, WEBP · Free preview · AI Restore is 1 credit per photo · Natural result, not exact original'
    },
    flow: {
      errors: {
        type: 'Please upload a JPG, PNG, or WEBP image.',
        size: 'Please upload an image smaller than 10MB.',
        upload: 'Upload failed. Please try again.',
        signIn: 'Please sign in with Google before restoring an image.',
        credits: 'Buy credits before creating another restoration job.'
      },
      notices: {
        freeReady: 'Free preview is ready. Compare it before using AI Restore.',
        freeFailed: 'Free preview failed. Please try another image.'
      },
      hero: {
        headerEyebrow: 'Free preview',
        headerTitle: 'Upload your photo',
        noSubscription: 'No subscription',
        eyebrow: 'Matcha filter remover',
        title: 'Clean the green cast before it ruins the photo.',
        description: 'Start with a local free preview. Use AI Restore only when the saved photo needs stronger matcha filter removal.',
        uploadLabel: 'Upload a photo',
        uploadHint: 'JPG, PNG, or WEBP up to 10MB',
        previewReady: 'Preview ready',
        selectedImage: 'Selected image',
        replaceHint: 'Drop another JPG, PNG, or WEBP to replace it.',
        stepUpload: 'Step 1 · Upload',
        chooseDrop: 'Choose or drop your photo',
        uploadDescription: 'Use a JPG, PNG, or WEBP image under 10MB. Works best on visible green or yellow tint, especially skin, food, and white backgrounds.',
        chooseAnother: 'Choose another image',
        noImage: 'No image selected yet',
        basicTitle: 'Preview basic color cleanup',
        freeButton: 'Run free preview',
        freeLoading: 'Processing preview...',
        refreshPreview: 'Refresh preview',
        aiButton: 'Create AI Restore',
        aiLoading: 'Creating AI Restore...',
        signInButton: 'Sign in for AI Restore',
        restoreWithAi: 'Restore with AI',
        signInRestore: 'Sign in to restore',
        aiRunning: 'AI Restore running · {progress}%',
        credits: '{count} credits available',
        noCredits: 'No credits available',
        buyCredits: 'Buy credits',
        viewCredits: 'View credits',
        previewTitle: 'Free browser preview',
        previewText: 'Fast local cleanup for green or yellow tint. It stays in your browser until you create AI Restore.',
        before: 'Before',
        original: 'Original',
        after: 'After free preview',
        downloadFree: 'Download free preview',
        freeHelp: 'Run the free preview to see whether the cast is light enough to stop here or whether AI Restore is worth 1 credit.',
        aiTitle: 'Still looks too green?',
        oneCredit: '1 credit',
        aiDescription: 'Use AI Restore when the free preview still leaves a strong cast or when you want a more natural-looking finish.',
        needCredits: 'You need credits before restoring this image.',
        footerNote: 'Free preview stays in your browser. AI Restore uploads the selected image for processing.',
        waiting: 'Waiting for image',
        resultEmpty: 'Run the free preview to see a local comparison.'
      },
      options: {
        title: 'AI Restore settings',
        description: 'Tune the paid AI pass before creating the job.',
        restoreMode: 'Restore strength',
        whiteBalance: 'White balance',
        skinTone: 'Prioritize natural skin tones',
        natural: 'Natural restore',
        light: 'Light restore',
        strong: 'Strong restore',
        standard: 'Standard white balance',
        soft: 'Soft white balance',
        strongWhite: 'Strong white balance'
      },
      progress: {
        title: 'AI Restore is running',
        description: 'Keep this page open. We will check the result automatically.',
        creating: 'Creating upload and job records',
        status: 'Status: {status}',
        checking: 'Checking result automatically',
        waiting: 'Waiting for next step',
        view: 'View AI Result Studio ↓'
      },
      result: {
        eyebrow: 'AI Result Studio',
        title: 'Your restored image is ready here.',
        description: 'Review the AI Restore output directly on this page. Natural result, not exact original.',
        open: 'Open image in new tab',
        download: 'Download image',
        originalMissing: 'Original image not available',
        before: 'Before',
        after: 'After · AI restored',
        complete: '{progress}% complete',
        originalAlt: 'Original before AI restore',
        resultAlt: 'AI restored full result'
      },
      infoCards: [
        { title: 'Free preview vs AI Restore', text: 'Free preview is a quick browser pass; AI Restore gives the stronger paid pass.' },
        { title: 'Best input', text: 'Use photos with visible green or yellow tint. Very dark, blurry, or heavily compressed files work less well.' },
        { title: 'Credit model', text: 'There is no subscription. 1 credit creates 1 AI Restore.' }
      ],
      stages: { creating: 'Creating job', queued: 'Queued', processing: 'Processing', checking: 'Checking result', failed: 'Failed' }
    }
  },
  pricing: {
    packUseCases: {
      try_499_8: 'For testing one small photo batch.',
      popular_1499_45: 'For a small set of saved photos.',
      pro_3999_160: 'For creators cleaning larger batches.'
    } satisfies Record<CreditPack['id'], string>,
    packs: {
      try_499_8: { name: 'Try', description: 'Low-risk starter pack for checking how AI Restore handles your photos.', features: ['8 AI Restores', 'Small starter pack', 'Good for testing results'] },
      popular_1499_45: { name: 'Popular', badge: 'Best value', description: 'Recommended pack for a small photo set or regular color fixes.', features: ['45 AI Restores', 'Best value per small set', 'Failed jobs return the credit'] },
      pro_3999_160: { name: 'Pro', description: 'Batch-friendly pack for creators or larger photo cleanup sessions.', features: ['160 AI Restores', 'Lowest cost per AI Restore', 'Built for batch experiments'] }
    },
    hero: {
      eyebrow: 'Pricing',
      description: 'Preview locally for free. Buy credits only when you want AI Restore to create a stronger natural result.',
      pillOne: 'No subscription',
      pillTwo: '1 credit = 1 AI Restore',
      pillThree: 'Credits valid for 12 months',
      panelEyebrow: 'Credit rule',
      panelTitle: 'Free preview costs nothing. AI Restore uses credits.',
      panelText: 'A failed AI job returns the used credit automatically, so you only pay for completed processing.'
    },
    labels: {
      perRestore: '/ AI Restore',
      creditRule: '{count} credits · 1 credit = 1 AI Restore'
    },
    faq: {
      eyebrow: 'Pricing FAQ',
      title: 'Questions before you buy credits.',
      description: 'Short answers for credits, Free preview, AI Restore, expiry, failed jobs, and refunds.',
      items: [
        { question: 'Is there a subscription?', answer: 'No. Credits are prepaid packs, and unused paid credits remain valid for 12 months.' },
        { question: 'What uses a credit?', answer: 'Only creating an AI Restore job uses 1 credit. Selecting a file and running the free browser preview do not use credits.' },
        { question: 'What if a job fails?', answer: 'If the service fails before producing a result, the used credit is returned automatically.' },
        { question: 'Can I get a refund?', answer: 'You can contact support within 7 days for unused paid credits. Credits already used for completed AI Restore jobs are not refundable.' }
      ]
    },
    guardrails: {
      eyebrow: 'Pricing guardrails',
      title: 'Credits buy AI Restore processing.',
      text: 'AI Restore can reduce green or yellow cast, but it cannot guarantee exact original reconstruction. If a service failure produces no result, the used credit is returned automatically.'
    },
    creditsHeading: {
      buy: 'Buy credits only when you need AI Restore.',
      remaining: 'You have {count} credits remaining.'
    },
    buyButton: {
      loading: 'Opening PayPal...',
      buy: 'Buy credits',
      signIn: 'Sign in to buy',
      checkoutError: 'Unable to create checkout.',
      startError: 'Unable to start checkout.'
    }
  },
  myImages: {
    eyebrow: 'Private Matcha Vault',
    title: 'My private AI restored images.',
    description: 'Only AI Restore results are saved here. Free preview images stay in your browser and are not added to your history.',
    panelEyebrow: 'Privacy first',
    panelTitle: 'Private to your signed-in account.',
    panelText: 'Your images are not shown publicly. Manage completed AI Restore results, download them again, or remove them from history.',
    cards: [
      { title: 'AI Restore results only', text: 'Free preview images stay local in your browser and do not appear in this gallery.' },
      { title: 'Private account access', text: 'History is loaded only after Google sign-in and scoped to your account.' },
      { title: 'Download or delete', text: 'Save a completed result again, or remove it from your image history.' }
    ],
    gallery: {
      loading: { eyebrow: 'Loading images', title: 'Fetching your private results.', text: 'Your completed AI Restore images will appear here in a moment.' },
      signedOut: { eyebrow: 'Sign in required', title: 'Sign in to view your AI restored images.', text: 'Your gallery is private and linked to your Google account.', cta: 'Sign in with Google' },
      empty: { eyebrow: 'No results yet', title: 'Create an AI Restore result to fill this gallery.', text: 'Free previews stay local. Only completed AI Restore jobs are saved here.', cta: 'Upload a photo' },
      error: { eyebrow: 'Gallery error', title: 'We could not load your image history.', retry: 'Try again' },
      title: 'Completed AI Restore results',
      subtitle: '{count} saved images',
      download: 'Download',
      delete: 'Delete',
      deleting: 'Deleting...',
      open: 'Open image',
      before: 'Before',
      after: 'After',
      recently: 'recently',
      modes: { light: 'Light restore', natural: 'Natural restore', strong: 'Strong restore', soft: 'Soft white balance', standard: 'Standard white balance', strongWhite: 'Strong white balance', skin: 'Skin tone priority' }
    }
  },
  blog: {
    eyebrow: 'Matcha filter blog',
    title: 'Guides for understanding and reducing matcha-style photo filters.',
    description: 'Start here if a saved photo looks too green, yellow, muted, or hazy. These articles explain the filter and the safest cleanup workflow.',
    pathTitle: 'Recommended path',
    pathText: 'Process free in browser first, then spend 1 credit on AI Restore only when basic cleanup is not enough.',
    posts: [
      { href: '/what-is-matcha-filter', label: 'Definition guide', title: 'What Is a Matcha Filter? Green Tint Photo Filter Explained', description: 'Learn what a matcha-style filter means for photos, how it affects skin tones and whites, and when cleanup can help.', cta: 'Read the explanation' },
      { href: '/how-to-remove-matcha-filter', label: 'How-to guide', title: 'How to Remove Matcha Filter from a Photo Online', description: 'Follow the shortest path: upload a saved photo, process free in browser, then use AI Restore if the tint needs stronger correction.', cta: 'Read the steps' },
      { href: '/tiktok-remove-matcha-filter', label: 'TikTok tool', title: 'TikTok Remove Matcha Filter – Clean TikTok Photos Online', description: 'Remove matcha filter from TikTok screenshots and saved photos. Free browser preview, then AI Restore for natural results.', cta: 'Try the tool' },
      { href: '/youtube-remove-matcha-filter', label: 'YouTube tool', title: 'YouTube Remove Matcha Filter – Clean YouTube Thumbnails and Screenshots', description: 'Remove matcha filter from YouTube thumbnails, screenshots, and saved photos. Free browser preview, then AI Restore for natural results.', cta: 'Try the tool' }
    ]
  },
  tiktok: {
    eyebrow: 'TikTok matcha filter remover',
    title: 'Remove Matcha Filter from TikTok Photos',
    description: 'Saved a TikTok screenshot or photo that looks too green, yellow, or muted? Upload it here to reduce the matcha-style color cast and get a more natural-looking result.',
    cta: 'Upload a TikTok photo',
    secondaryCta: 'How it works',
    whatIs: {
      eyebrow: 'About TikTok matcha filter',
      title: 'What is a TikTok matcha filter?',
      paragraphs: [
        'On TikTok, a matcha filter refers to a popular editing style that pushes photos and video frames toward soft green, yellow, olive, or muted beige tones. Creators use it to give portraits, food clips, travel vlogs, and lifestyle content a calm, cinematic, or vintage feel.',
        'The problem starts when you save a screenshot or photo from TikTok and no longer have the original. The green or yellow cast looks stylish in a feed but strange when you want a clean profile picture, product shot, or family photo.',
        'This tool helps reduce that color cast. Upload the saved image, preview a free browser cleanup, then use AI Restore if the tint needs stronger correction.'
      ]
    },
    imageGuide: {
      eyebrow: 'Best image size',
      title: 'Upload the best quality TikTok screenshot',
      description: 'TikTok content is vertical. For the best cleanup result, upload the highest-resolution screenshot or saved photo you have.',
      specs: [
        { label: 'TikTok video screenshot', value: '1080 × 1920 (9:16)' },
        { label: 'TikTok profile photo', value: '200 × 200 (1:1)' },
        { label: 'Max upload size', value: '10 MB (JPG, PNG, WEBP)' }
      ]
    },
    examples: {
      eyebrow: 'Common use cases',
      title: 'When to use TikTok matcha filter remover',
      items: [
        { title: 'Saved TikTok screenshots', text: 'A screenshot from a TikTok video that looks too green or yellow. Upload it to reduce the cast before sharing elsewhere.' },
        { title: 'TikTok profile pictures', text: 'Your TikTok profile photo has a matcha-style tint but you want a cleaner version for LinkedIn, Instagram, or a resume.' },
        { title: 'Product photos from TikTok', text: 'A product clip looks great in the TikTok feed but the saved image has a color cast that makes whites and skin look off.' },
        { title: 'Travel and food clips', text: 'A travel or food TikTok looks cinematic with the filter, but the saved photo feels too muted for your camera roll or blog.' }
      ]
    },
    faq: {
      eyebrow: 'TikTok FAQ',
      title: 'Frequently asked questions about TikTok matcha filter removal',
      items: [
        { question: 'Can I remove matcha filter from a TikTok video screenshot?', answer: 'Yes. Take a screenshot of the TikTok video or save the photo, then upload it here. The free browser preview reduces light color casts. Use AI Restore for stronger correction.' },
        { question: 'What is the best image size to upload from TikTok?', answer: 'TikTok uses 1080 × 1920 (9:16) for vertical content. Upload the highest-resolution version you have. Avoid screenshots of screenshots, as compression reduces the cleanup quality.' },
        { question: 'Does it work on TikTok beauty filters too?', answer: 'This tool focuses on color cast reduction — green tint, yellow cast, and muted tones. It is not designed to remove beauty reshaping, AR face changes, stickers, or text overlays.' },
        { question: 'Is the free preview really free?', answer: 'Yes. The browser preview does not upload your photo and does not use credits. AI Restore uses 1 credit per photo only when you need stronger correction.' },
        { question: 'Can I use the cleaned photo on other platforms?', answer: 'Yes. Once you download the result, you can use it anywhere — Instagram, LinkedIn, your website, or print. Only upload photos you own or have permission to edit.' }
      ]
    }
  },
  youtube: {
    eyebrow: 'YouTube matcha filter remover',
    title: 'Remove Matcha Filter from YouTube Photos',
    description: 'Saved a YouTube thumbnail, screenshot, or photo that looks too green, yellow, or muted? Upload it here to reduce the matcha-style color cast and get a more natural-looking result.',
    cta: 'Upload a YouTube photo',
    secondaryCta: 'How it works',
    whatIs: {
      eyebrow: 'About YouTube matcha filter',
      title: 'What is a YouTube matcha filter?',
      paragraphs: [
        'On YouTube, a matcha filter refers to a color grading style that pushes thumbnails, video frames, and channel art toward soft green, yellow, olive, or muted beige tones. Creators use it to give vlogs, tutorials, lifestyle content, and talking-head videos a warmer, more cinematic look.',
        'The problem starts when you save a thumbnail, screenshot, or frame from a YouTube video. The matcha-style color cast looks intentional in a video but strange when you need a clean image for a presentation, blog post, or social profile.',
        'This tool helps reduce that color cast. Upload the saved image, preview a free browser cleanup, then use AI Restore if the tint needs stronger correction.'
      ]
    },
    imageGuide: {
      eyebrow: 'Best image size',
      title: 'Upload the best quality YouTube image',
      description: 'YouTube content is mostly horizontal. For the best cleanup result, upload the highest-resolution thumbnail or screenshot you have.',
      specs: [
        { label: 'YouTube thumbnail', value: '1280 × 720 (16:9)' },
        { label: 'YouTube video screenshot', value: '1920 × 1080 (16:9)' },
        { label: 'Max upload size', value: '10 MB (JPG, PNG, WEBP)' }
      ]
    },
    examples: {
      eyebrow: 'Common use cases',
      title: 'When to use YouTube matcha filter remover',
      items: [
        { title: 'YouTube thumbnails', text: 'A YouTube thumbnail has a matcha-style tint but you want a cleaner version for repurposing or a different platform.' },
        { title: 'Video screenshots', text: 'A screenshot from a YouTube video looks too green or yellow. Upload it to reduce the cast before using it in a presentation or article.' },
        { title: 'Channel banner art', text: 'Your channel banner or profile image has a color cast that looks off when viewed outside YouTube.' },
        { title: 'Educational content frames', text: 'A tutorial or educational video frame has a warm tint that makes text, diagrams, or skin tones look unnatural when saved.' }
      ]
    },
    faq: {
      eyebrow: 'YouTube FAQ',
      title: 'Frequently asked questions about YouTube matcha filter removal',
      items: [
        { question: 'Can I remove matcha filter from a YouTube thumbnail?', answer: 'Yes. Save or screenshot the thumbnail, then upload it here. The free browser preview reduces light color casts. Use AI Restore for stronger correction.' },
        { question: 'What is the best image size to upload from YouTube?', answer: 'YouTube thumbnails are 1280 × 720 (16:9). Video screenshots can be up to 1920 × 1080. Upload the highest-resolution version you have for the best cleanup result.' },
        { question: 'Does it work on YouTube video frames too?', answer: 'Yes. Any saved image with a green, yellow, or matcha-style color cast can be processed. This includes video screenshots, thumbnails, and channel art.' },
        { question: 'Is the free preview really free?', answer: 'Yes. The browser preview does not upload your photo and does not use credits. AI Restore uses 1 credit per photo only when you need stronger correction.' },
        { question: 'Can I use the cleaned image as a new thumbnail?', answer: 'You can download and reuse the result, but note that this tool reduces color cast — it does not add text, compose layouts, or create new thumbnails from scratch.' }
      ]
    }
  },
  feedback: {
    button: 'Feedback',
    eyebrow: 'Matcha feedback',
    title: 'Send feedback',
    description: 'Bugs, ideas, praise, or a quick note.',
    close: 'Close feedback dialog',
    type: 'Feedback type',
    message: 'Your message',
    placeholder: 'What worked, what did not, what you wish existed...',
    contact: 'Email or handle',
    optional: 'optional',
    contactPlaceholder: 'So we can reply if needed',
    sending: 'Sending...',
    submit: 'Send feedback',
    note: 'Anonymous unless you add contact details. The current page is saved with your message.',
    success: 'Thanks — feedback sent.',
    error: 'Feedback failed. Please try again.',
    types: { bug: 'Bug', idea: 'Idea', praise: 'Praise', other: 'Other' }
  }
};

export type Dictionary = DeepWiden<typeof englishDictionary>;

// filipinoDictionary 面向菲律宾市场，保留核心英文搜索词以匹配真实搜索意图。
const filipinoDictionary: Dictionary = {
  ...englishDictionary,
  common: {
    ...englishDictionary.common,
    tagline: 'Natural photo recovery gamit ang AI',
    nav: { remove: 'Remove', pricing: 'Pricing', myImages: 'My Images', blog: 'Blog', faq: 'FAQ' },
    auth: { checking: 'Tinitingnan ang login...', signIn: 'Mag-sign in', signOut: 'Mag-sign out', signOutWithName: 'Mag-sign out · {name}' },
    language: { label: 'Wika', button: 'Wika', menu: 'Pumili ng wika' },
    mobileMenu: { menu: 'Menu', open: 'Buksan ang navigation menu', close: 'Isara ang navigation menu' },
    footer: { brand: 'Remove Matcha Filter · Natural photo recovery gamit ang AI', privacy: 'Privacy', terms: 'Terms', refund: 'Refund', contact: 'Contact:',
      tools: 'Tools',
      legal: 'Legal',
      tiktok: 'TikTok Remove Matcha Filter',
      youtube: 'YouTube Remove Matcha Filter' }
  },
  metadata: {
    ...englishDictionary.metadata,
    home: { title: 'Matcha Filter Remover – Alisin ang Matcha Filter sa Larawan', description: 'Gamitin ang matcha filter remover para bawasan ang green tint, yellow cast, at muted colors sa larawan. May free preview bago ang AI Restore.' },
    upload: { title: 'Matcha Filter Remover Online para sa Larawan', description: 'Mag-upload ng larawan, tingnan ang free preview, at gamitin ang AI Restore kapag kailangan ng mas malakas na matcha filter removal.' },
    pricing: { title: 'Pricing | Remove Matcha Filter', description: 'Bumili lang ng credits kapag kailangan mo ng AI Restore. Walang subscription, may free preview muna, at ibinabalik ang credit kapag pumalya ang job.' },
    faq: { title: 'FAQ | Remove Matcha Filter', description: 'Mga sagot tungkol sa matcha filter remover, free preview, AI Restore credits, privacy ng larawan, formats, at refunds.' },
    blog: { title: 'Matcha Filter Blog: Guides at Photo Cleanup Tips', description: 'Basahin ang guides tungkol sa matcha filter, green tint, yellow cast, free browser processing, at AI Restore.' },
    whatIs: { title: 'Ano ang Matcha Filter? Paliwanag sa Green Tint Photo Filter', description: 'Alamin kung ano ang matcha-style filter, bakit nagmumukhang green o yellow ang photo, at kailan makakatulong ang matcha filter remover.' },
    howTo: { title: 'Paano Mag-remove ng Matcha Filter from Photo Online', description: 'Sundin ang simpleng workflow: upload, free preview, tapos AI Restore kung kailangan ng mas malakas na cleanup.' },
    privacy: { title: 'Privacy Policy | Remove Matcha Filter', description: 'Alamin kung paano hinahandle ang uploads, AI Restore jobs, account data, payments, analytics, at feedback.' },
    terms: { title: 'Terms of Service | Remove Matcha Filter', description: 'Basahin ang terms para sa paggamit ng Remove Matcha Filter, AI Restore credits, uploads, refunds, at limitations.' },
    refund: { title: 'Refund Policy | Remove Matcha Filter', description: 'Alamin ang refund rules, failed AI Restore jobs, credit returns, unused paid credits, at support contact.' },
    myImages: { title: 'My Images | Remove Matcha Filter', description: 'Tingnan ang private AI Restore results sa signed-in account mo.' }
  },
  home: {
    ...englishDictionary.home,
    heroPills: ['JPG / PNG / WEBP', 'Free process sa browser', 'AI Restore uses 1 credit'],
    proofMetrics: [
      { value: '3-step', label: 'upload hanggang download flow' },
      { value: '1 credit', label: 'bawat AI Restore attempt' },
      { value: '0 promise', label: 'ng fake original pixels' }
    ],
    steps: [
      { title: 'Upload', text: 'Pumili ng isang JPG, PNG, o WEBP photo na may matcha-style cast.' },
      { title: 'Preview', text: 'Tingnan muna ang free browser cleanup bago magpasya kung kailangan pa ang AI.' },
      { title: 'AI Restore', text: 'Gumamit ng 1 credit para sa mas malakas na bawas sa green tint at yellow cast.' }
    ],
    resultFeatures: [
      { title: 'Before / After', text: 'Tingnan kung gaano nabawasan ang green o yellow cast.' },
      { title: 'Natural balance', text: 'I-judge ang output sa natural na kulay, hindi sa pixel-perfect reconstruction.' },
      { title: 'Ready to download', text: 'I-save ang restored image kapag tama na ang itsura.' }
    ],
    faqs: englishDictionary.home.faqs.map((faq) => ({ ...faq })),
    hero: { eyebrow: 'Remove Matcha Filter', title: 'Remove Matcha Filter from Your Photo', description: 'Mag-upload ng photo at hayaang bawasan ng AI ang greenish, yellowish, o matcha-style color cast habang natural pa rin ang resulta.', primaryCta: 'Upload a photo', secondaryCta: 'View credits', restoreLabel: 'AI Restore', restoreText: 'Mas malakas na tint reduction kapag mukhang sobrang green pa ang photo.' },
    result: { eyebrow: 'Result preview', title: 'Ihambing ang color recovery bago mag-download.', description: 'Dapat i-judge ang result sa natural color balance, hindi sa pangakong maibabalik ang untouched original file.' },
    how: { eyebrow: 'How it works', title: 'Tatlong hakbang mula cast hanggang balance.', description: 'Focused flow para sa isang photo kada beses, gamit ang malinaw na before at after decision.' },
    faq: { eyebrow: 'FAQ', title: 'Alamin ang limits bago mag-upload.' }
  },
  upload: {
    ...englishDictionary.upload,
    top: { back: 'Balik sa home', badge: 'Matcha filter remover' },
    guidanceSteps: [
      { title: 'Upload', text: 'Mag-drop ng isang photo na may malinaw na matcha-style green o yellow cast.' },
      { title: 'Preview', text: 'Patakbuhin muna ang free preview bago gumamit ng credit.' },
      { title: 'Restore', text: 'Gamitin ang AI Restore kapag kailangan pa ng mas malakas na cast reduction.' }
    ],
    intro: { eyebrow: 'Photo cleanup workflow', title: 'Upload, preview, tapos restore.', description: 'Magsimula sa free preview. Kung may green o yellow cast pa rin ang photo, gumamit ng AI Restore with 1 credit para sa mas natural na resulta.', pills: ['Free preview muna', '1 credit para sa AI Restore', 'Natural result, hindi exact original'], footer: 'JPG, PNG, WEBP · Free preview · AI Restore ay 1 credit bawat photo · Natural result, hindi exact original' },
    flow: {
      ...englishDictionary.upload.flow,
      errors: { type: 'Mag-upload ng JPG, PNG, o WEBP image.', size: 'Mag-upload ng image na mas maliit sa 10MB.', upload: 'Hindi nagtagumpay ang upload. Subukan ulit.', signIn: 'Mag-sign in gamit ang Google bago mag-restore ng image.', credits: 'Bumili muna ng credits bago gumawa ng restoration job.' },
      notices: { freeReady: 'Ready na ang free preview. Ihambing muna bago gamitin ang AI Restore.', freeFailed: 'Hindi nagtagumpay ang free preview. Subukan ang ibang image.' },
      hero: { ...englishDictionary.upload.flow.hero, headerEyebrow: 'Free preview', headerTitle: 'I-upload ang photo mo', noSubscription: 'No subscription', eyebrow: 'Matcha filter remover', title: 'Linisin ang green cast bago masira ang photo.', description: 'Magsimula sa local free preview. Gamitin lang ang AI Restore kapag kailangan ng mas malakas na remove matcha filter from photo.', uploadLabel: 'Upload a photo', previewReady: 'Ready na ang preview', selectedImage: 'Selected image', replaceHint: 'Mag-drop ng ibang JPG, PNG, o WEBP para palitan ito.', stepUpload: 'Step 1 · Upload', chooseDrop: 'Pumili o mag-drop ng photo', uploadDescription: 'Gumamit ng JPG, PNG, o WEBP image under 10MB. Pinakamaganda sa visible green o yellow tint, lalo na skin, food, at white backgrounds.', chooseAnother: 'Pumili ng ibang image', noImage: 'Wala pang image', basicTitle: 'Preview basic color cleanup', freeButton: 'Run free preview', freeLoading: 'Pinoproseso ang preview...', refreshPreview: 'Refresh preview', aiButton: 'Create AI Restore', aiLoading: 'Gumagawa ng AI Restore...', signInButton: 'Sign in for AI Restore', restoreWithAi: 'Restore with AI', signInRestore: 'Sign in to restore', aiRunning: 'AI Restore running · {progress}%', credits: '{count} credits available', noCredits: 'Walang credits', buyCredits: 'Buy credits', viewCredits: 'View credits', previewTitle: 'Free browser preview', previewText: 'Mabilis na local cleanup para sa green o yellow tint. Nasa browser lang ito hanggang gumawa ka ng AI Restore.', before: 'Before', original: 'Original', after: 'After free preview', downloadFree: 'Download free preview', freeHelp: 'Run the free preview para makita kung sapat na ang light cleanup o kailangan ang AI Restore na 1 credit.', aiTitle: 'Mukha pa ring sobrang green?', oneCredit: '1 credit', aiDescription: 'Gamitin ang AI Restore kapag may strong cast pa rin sa free preview o gusto mo ng mas natural-looking finish.', needCredits: 'Kailangan mo ng credits bago i-restore ang image na ito.', footerNote: 'Ang free preview ay nasa browser mo lang. Ina-upload ng AI Restore ang selected image para sa processing.', waiting: 'Naghihintay ng image', resultEmpty: 'Run the free preview para makita ang local comparison.' },
      options: { ...englishDictionary.upload.flow.options, title: 'AI Restore settings', description: 'I-tune ang paid AI pass bago gumawa ng job.', restoreMode: 'Restore strength', whiteBalance: 'White balance', skinTone: 'Unahin ang natural skin tones' },
      progress: { title: 'Tumatakbo ang AI Restore', description: 'Panatilihing bukas ang page. Awtomatikong iche-check ang result.', creating: 'Gumagawa ng upload at job records', status: 'Status: {status}', checking: 'Awtomatikong chine-check ang result', waiting: 'Naghihintay ng next step', view: 'View AI Result Studio ↓' },
      result: { ...englishDictionary.upload.flow.result, title: 'Ready na ang restored image mo dito.', description: 'I-review ang AI Restore output sa page na ito. Natural result, hindi exact original.', open: 'Open image in new tab', download: 'Download image', originalMissing: 'Hindi available ang original image' },
      infoCards: [
        { title: 'Free preview vs AI Restore', text: 'Ang free preview ay mabilis na browser pass; ang AI Restore ang mas malakas na paid pass.' },
        { title: 'Best input', text: 'Gumamit ng photos na may visible green o yellow tint. Mas mahina sa very dark, blurry, o heavily compressed files.' },
        { title: 'Credit model', text: 'Walang subscription. 1 credit ang gumagawa ng 1 AI Restore.' }
      ],
      stages: { creating: 'Creating job', queued: 'Queued', processing: 'Processing', checking: 'Checking result', failed: 'Failed' }
    }
  },
  pricing: {
    ...englishDictionary.pricing,
    packUseCases: { try_499_8: 'Para sa maliit na test batch.', popular_1499_45: 'Para sa maliit na set ng saved photos.', pro_3999_160: 'Para sa creators na may mas malaking batches.' },
    packs: {
      try_499_8: { name: 'Try', description: 'Low-risk starter pack para makita kung paano hahandle ng AI Restore ang photos mo.', features: ['8 AI Restores', 'Maliit na starter pack', 'Maganda para sa testing'] },
      popular_1499_45: { name: 'Popular', badge: 'Best value', description: 'Recommended pack para sa maliit na photo set o regular color fixes.', features: ['45 AI Restores', 'Best value para sa small set', 'Failed jobs return the credit'] },
      pro_3999_160: { name: 'Pro', description: 'Batch-friendly pack para sa creators o mas malaking cleanup sessions.', features: ['160 AI Restores', 'Lowest cost per AI Restore', 'Para sa batch experiments'] }
    },
    hero: { eyebrow: 'Pricing', description: 'Mag-preview nang libre locally. Bumili lang ng credits kapag gusto mo ng AI Restore para sa mas malakas at natural na resulta.', pillOne: 'No subscription', pillTwo: '1 credit = 1 AI Restore', pillThree: 'Credits valid for 12 months', panelEyebrow: 'Credit rule', panelTitle: 'Free ang preview. AI Restore ang gumagamit ng credits.', panelText: 'Kapag pumalya ang AI job at walang result, automatic na ibabalik ang ginamit na credit.' },
    labels: { perRestore: '/ AI Restore', creditRule: '{count} credits · 1 credit = 1 AI Restore' },
    faq: { ...englishDictionary.pricing.faq, title: 'Mga tanong bago bumili ng credits.', description: 'Maikling sagot tungkol sa credits, Free preview, AI Restore, expiry, failed jobs, at refunds.' },
    guardrails: { eyebrow: 'Pricing guardrails', title: 'Credits buy AI Restore processing.', text: 'Mababawasan ng AI Restore ang green o yellow cast, pero hindi nito magagarantiya ang exact original reconstruction. Kapag pumalya ang service at walang result, automatic na ibabalik ang used credit.' },
    creditsHeading: { buy: 'Bumili lang ng credits kapag kailangan mo ng AI Restore.', remaining: 'Mayroon kang {count} credits remaining.' },
    buyButton: { loading: 'Binubuksan ang PayPal...', buy: 'Buy credits', signIn: 'Sign in to buy', checkoutError: 'Hindi makagawa ng checkout.', startError: 'Hindi masimulan ang checkout.' }
  },
  myImages: {
    ...englishDictionary.myImages,
    eyebrow: 'Private Matcha Vault',
    title: 'Aking private AI restored images.',
    description: 'AI Restore results lang ang naka-save dito. Ang free preview images ay nananatili sa browser at hindi nadadagdag sa history.',
    panelEyebrow: 'Privacy first',
    panelTitle: 'Private sa signed-in account mo.',
    panelText: 'Hindi ipinapakita publicly ang images mo. I-manage ang completed AI Restore results, i-download ulit, o alisin sa history.',
    cards: [
      { title: 'AI Restore results only', text: 'Ang free preview images ay local lang sa browser at hindi lilitaw sa gallery.' },
      { title: 'Private account access', text: 'Malo-load lang ang history pagkatapos ng Google sign-in at para lang sa account mo.' },
      { title: 'Download or delete', text: 'I-save ulit ang completed result, o alisin ito sa image history.' }
    ],
    gallery: { ...englishDictionary.myImages.gallery, signedOut: { eyebrow: 'Kailangan mag-sign in', title: 'Mag-sign in para makita ang AI restored images mo.', text: 'Private ang gallery at naka-link sa Google account mo.', cta: 'Sign in with Google' }, empty: { eyebrow: 'Wala pang results', title: 'Gumawa ng AI Restore result para mapuno ang gallery.', text: 'Local lang ang free previews. Completed AI Restore jobs lang ang naka-save dito.', cta: 'Upload a photo' }, title: 'Completed AI Restore results', subtitle: '{count} saved images' }
  },
  blog: {
    ...englishDictionary.blog,
    eyebrow: 'Matcha filter blog',
    title: 'Guides para maintindihan at mabawasan ang matcha-style photo filters.',
    description: 'Magsimula dito kung masyadong green, yellow, muted, o hazy ang saved photo. Ipinapaliwanag ng articles ang filter at safest cleanup workflow.',
    pathTitle: 'Recommended path',
    pathText: 'Mag-process muna nang libre sa browser, tapos gumamit ng 1 credit sa AI Restore kung hindi sapat ang basic cleanup.',
    posts: [
      { href: '/what-is-matcha-filter', label: 'Definition guide', title: 'Ano ang Matcha Filter? Paliwanag sa Green Tint Photo Filter', description: 'Alamin kung ano ang matcha-style filter sa photos, paano nito naaapektuhan ang skin tones at whites, at kailan makakatulong ang cleanup.', cta: 'Basahin ang paliwanag' },
      { href: '/how-to-remove-matcha-filter', label: 'How-to guide', title: 'Paano Mag-remove ng Matcha Filter from Photo Online', description: 'Sundin ang pinakamaikling path: upload ng saved photo, free process sa browser, tapos AI Restore kung kailangan ng mas malakas na correction.', cta: 'Basahin ang steps' }
    ]
  },
  feedback: { ...englishDictionary.feedback, button: 'Feedback', title: 'Mag-send ng feedback', description: 'Bugs, ideas, praise, o quick note.', type: 'Feedback type', message: 'Message mo', placeholder: 'Ano ang gumana, ano ang hindi, ano ang gusto mong magkaroon...', contact: 'Email o handle', optional: 'optional', contactPlaceholder: 'Para makapag-reply kami kung kailangan', sending: 'Sending...', submit: 'Send feedback', note: 'Anonymous maliban kung magdagdag ka ng contact details. Naka-save ang current page kasama ng message.', success: 'Salamat — naipadala ang feedback.', error: 'Hindi naipadala ang feedback. Subukan ulit.' }
};

// indonesianDictionary 面向印尼市场，保留核心英文搜索词以匹配真实搜索意图。
const indonesianDictionary: Dictionary = {
  ...englishDictionary,
  common: {
    ...englishDictionary.common,
    tagline: 'Pemulihan foto natural dengan AI',
    nav: { remove: 'Remove', pricing: 'Harga', myImages: 'Gambar Saya', blog: 'Blog', faq: 'FAQ' },
    auth: { checking: 'Memeriksa login...', signIn: 'Masuk', signOut: 'Keluar', signOutWithName: 'Keluar · {name}' },
    language: { label: 'Bahasa', button: 'Bahasa', menu: 'Pilih bahasa' },
    mobileMenu: { menu: 'Menu', open: 'Buka menu navigasi', close: 'Tutup menu navigasi' },
    footer: { brand: 'Remove Matcha Filter · Pemulihan foto natural dengan AI', privacy: 'Privasi', terms: 'Ketentuan', refund: 'Refund', contact: 'Kontak:', tools: 'Tools',
      legal: 'Legal', tiktok: 'TikTok Remove Matcha Filter', youtube: 'YouTube Remove Matcha Filter' }
  },
  metadata: {
    ...englishDictionary.metadata,
    home: { title: 'Matcha Filter Remover – Hapus Matcha Filter dari Foto', description: 'Gunakan matcha filter remover untuk mengurangi green tint, yellow cast, dan warna kusam dari foto. Preview gratis sebelum AI Restore.' },
    upload: { title: 'Matcha Filter Remover Online untuk Foto', description: 'Upload foto, lihat preview gratis, lalu gunakan AI Restore jika perlu hapus matcha filter dari foto dengan lebih kuat.' },
    pricing: { title: 'Harga | Remove Matcha Filter', description: 'Beli credits hanya saat perlu AI Restore. Tanpa subscription, preview gratis dulu, dan job gagal mengembalikan credit.' },
    faq: { title: 'FAQ | Remove Matcha Filter', description: 'Jawaban tentang matcha filter remover, preview gratis, credits AI Restore, privasi gambar, format, dan refund.' },
    blog: { title: 'Matcha Filter Blog: Panduan dan Tips Photo Cleanup', description: 'Baca panduan tentang matcha filter, green tint, yellow cast, proses gratis di browser, dan AI Restore.' },
    whatIs: { title: 'Apa Itu Matcha Filter? Penjelasan Green Tint Photo Filter', description: 'Pelajari arti matcha-style filter, kenapa foto terlihat hijau atau kuning, dan kapan matcha filter remover membantu.' },
    howTo: { title: 'Cara Remove Matcha Filter from Photo Online', description: 'Ikuti workflow sederhana: upload, preview gratis, lalu AI Restore jika perlu cleanup lebih kuat.' },
    privacy: { title: 'Kebijakan Privasi | Remove Matcha Filter', description: 'Pelajari cara kami menangani uploads, AI Restore jobs, data akun, pembayaran, analytics, dan feedback.' },
    terms: { title: 'Ketentuan Layanan | Remove Matcha Filter', description: 'Baca ketentuan penggunaan Remove Matcha Filter, credits AI Restore, uploads, refunds, dan batasan layanan.' },
    refund: { title: 'Kebijakan Refund | Remove Matcha Filter', description: 'Pahami refund, failed AI Restore jobs, credit returns, unused paid credits, dan kontak support.' },
    myImages: { title: 'Gambar Saya | Remove Matcha Filter', description: 'Lihat hasil AI Restore private di akun yang sudah masuk.' }
  },
  home: {
    ...englishDictionary.home,
    heroPills: ['JPG / PNG / WEBP', 'Proses gratis di browser', 'AI Restore memakai 1 credit'],
    proofMetrics: [
      { value: '3-step', label: 'alur upload sampai download' },
      { value: '1 credit', label: 'per percobaan AI Restore' },
      { value: '0 promise', label: 'pixel original palsu' }
    ],
    steps: [
      { title: 'Upload', text: 'Pilih satu foto JPG, PNG, atau WEBP dengan matcha-style cast yang terlihat.' },
      { title: 'Preview', text: 'Cek cleanup gratis di browser sebelum memutuskan apakah AI masih diperlukan.' },
      { title: 'AI Restore', text: 'Gunakan 1 credit untuk mengurangi green tint dan yellow cast lebih kuat.' }
    ],
    resultFeatures: [
      { title: 'Before / After', text: 'Cek seberapa banyak green atau yellow cast berkurang.' },
      { title: 'Natural balance', text: 'Nilai output dari warna yang natural, bukan rekonstruksi pixel-perfect.' },
      { title: 'Siap download', text: 'Simpan restored image saat hasilnya sudah terlihat pas.' }
    ],
    faqs: englishDictionary.home.faqs.map((faq) => ({ ...faq })),
    hero: { eyebrow: 'Remove Matcha Filter', title: 'Remove Matcha Filter from Your Photo', description: 'Upload foto dan biarkan AI mengurangi greenish, yellowish, atau matcha-style color cast sambil menjaga hasil tetap natural.', primaryCta: 'Upload foto', secondaryCta: 'Lihat credits', restoreLabel: 'AI Restore', restoreText: 'Tint reduction lebih kuat saat foto masih terlihat terlalu hijau.' },
    result: { eyebrow: 'Result preview', title: 'Bandingkan color recovery sebelum download.', description: 'Hasil sebaiknya dinilai dari natural color balance, bukan janji mengembalikan file original persis.' },
    how: { eyebrow: 'Cara kerja', title: 'Tiga langkah dari cast ke balance.', description: 'Flow fokus untuk satu foto tiap kali, berdasarkan keputusan before dan after yang terlihat.' },
    faq: { eyebrow: 'FAQ', title: 'Pahami batasannya sebelum upload.' }
  },
  upload: {
    ...englishDictionary.upload,
    top: { back: 'Kembali ke home', badge: 'Matcha filter remover' },
    guidanceSteps: [
      { title: 'Upload', text: 'Drop satu foto dengan matcha-style green atau yellow cast yang terlihat.' },
      { title: 'Preview', text: 'Jalankan preview gratis sebelum memakai credit.' },
      { title: 'Restore', text: 'Gunakan AI Restore saat gambar masih perlu cast reduction lebih kuat.' }
    ],
    intro: { eyebrow: 'Photo cleanup workflow', title: 'Upload, preview, lalu restore.', description: 'Mulai dengan preview gratis. Jika foto masih punya green atau yellow cast, gunakan AI Restore dengan 1 credit untuk hasil natural yang lebih kuat.', pills: ['Preview gratis dulu', '1 credit untuk AI Restore', 'Natural result, bukan exact original'], footer: 'JPG, PNG, WEBP · Preview gratis · AI Restore 1 credit per foto · Natural result, bukan exact original' },
    flow: {
      ...englishDictionary.upload.flow,
      errors: { type: 'Upload gambar JPG, PNG, atau WEBP.', size: 'Upload gambar yang lebih kecil dari 10MB.', upload: 'Upload gagal. Coba lagi.', signIn: 'Masuk dengan Google sebelum restore gambar.', credits: 'Beli credits sebelum membuat restoration job lagi.' },
      notices: { freeReady: 'Preview gratis sudah siap. Bandingkan sebelum memakai AI Restore.', freeFailed: 'Preview gratis gagal. Coba gambar lain.' },
      hero: { ...englishDictionary.upload.flow.hero, headerEyebrow: 'Free preview', headerTitle: 'Upload foto kamu', noSubscription: 'Tanpa subscription', eyebrow: 'Matcha filter remover', title: 'Bersihkan green cast sebelum foto rusak.', description: 'Mulai dengan local free preview. Gunakan AI Restore hanya saat perlu remove matcha filter from photo yang lebih kuat.', uploadLabel: 'Upload foto', previewReady: 'Preview siap', selectedImage: 'Selected image', replaceHint: 'Drop JPG, PNG, atau WEBP lain untuk mengganti.', stepUpload: 'Step 1 · Upload', chooseDrop: 'Pilih atau drop foto', uploadDescription: 'Gunakan JPG, PNG, atau WEBP di bawah 10MB. Paling cocok untuk green atau yellow tint yang terlihat, terutama skin, food, dan white backgrounds.', chooseAnother: 'Pilih gambar lain', noImage: 'Belum ada gambar dipilih', basicTitle: 'Preview basic color cleanup', freeButton: 'Jalankan preview gratis', freeLoading: 'Memproses preview...', refreshPreview: 'Refresh preview', aiButton: 'Buat AI Restore', aiLoading: 'Membuat AI Restore...', signInButton: 'Masuk untuk AI Restore', restoreWithAi: 'Restore dengan AI', signInRestore: 'Masuk untuk restore', aiRunning: 'AI Restore berjalan · {progress}%', credits: '{count} credits tersedia', noCredits: 'Tidak ada credits', buyCredits: 'Beli credits', viewCredits: 'Lihat credits', previewTitle: 'Preview gratis di browser', previewText: 'Cleanup lokal cepat untuk green atau yellow tint. Tetap di browser sampai kamu membuat AI Restore.', before: 'Before', original: 'Original', after: 'After free preview', downloadFree: 'Download free preview', freeHelp: 'Jalankan preview gratis untuk melihat apakah cast sudah cukup ringan atau AI Restore layak memakai 1 credit.', aiTitle: 'Masih terlihat terlalu hijau?', oneCredit: '1 credit', aiDescription: 'Gunakan AI Restore saat free preview masih menyisakan cast kuat atau kamu ingin finish yang lebih natural.', needCredits: 'Kamu perlu credits sebelum restore image ini.', footerNote: 'Free preview tetap di browser. AI Restore meng-upload selected image untuk processing.', waiting: 'Menunggu gambar', resultEmpty: 'Jalankan preview gratis untuk melihat perbandingan lokal.' },
      options: { ...englishDictionary.upload.flow.options, title: 'Pengaturan AI Restore', description: 'Atur paid AI pass sebelum membuat job.', restoreMode: 'Restore strength', whiteBalance: 'White balance', skinTone: 'Prioritaskan skin tone natural' },
      progress: { title: 'AI Restore sedang berjalan', description: 'Biarkan halaman ini terbuka. Kami akan mengecek hasil otomatis.', creating: 'Membuat upload dan job records', status: 'Status: {status}', checking: 'Mengecek hasil otomatis', waiting: 'Menunggu langkah berikutnya', view: 'View AI Result Studio ↓' },
      result: { ...englishDictionary.upload.flow.result, title: 'Restored image kamu sudah siap di sini.', description: 'Review output AI Restore langsung di halaman ini. Natural result, bukan exact original.', open: 'Buka image di tab baru', download: 'Download image', originalMissing: 'Original image tidak tersedia' },
      infoCards: [
        { title: 'Free preview vs AI Restore', text: 'Free preview adalah browser pass cepat; AI Restore memberi paid pass yang lebih kuat.' },
        { title: 'Best input', text: 'Gunakan foto dengan green atau yellow tint yang terlihat. File sangat gelap, blur, atau heavily compressed biasanya kurang bagus.' },
        { title: 'Credit model', text: 'Tidak ada subscription. 1 credit membuat 1 AI Restore.' }
      ],
      stages: { creating: 'Creating job', queued: 'Queued', processing: 'Processing', checking: 'Checking result', failed: 'Failed' }
    }
  },
  pricing: {
    ...englishDictionary.pricing,
    packUseCases: { try_499_8: 'Untuk mencoba satu batch foto kecil.', popular_1499_45: 'Untuk set kecil saved photos.', pro_3999_160: 'Untuk kreator dengan batch lebih besar.' },
    packs: {
      try_499_8: { name: 'Try', description: 'Starter pack rendah risiko untuk mengecek bagaimana AI Restore menangani foto kamu.', features: ['8 AI Restores', 'Starter pack kecil', 'Cocok untuk testing hasil'] },
      popular_1499_45: { name: 'Popular', badge: 'Best value', description: 'Paket rekomendasi untuk photo set kecil atau color fixes rutin.', features: ['45 AI Restores', 'Best value per small set', 'Failed jobs return the credit'] },
      pro_3999_160: { name: 'Pro', description: 'Paket batch-friendly untuk kreator atau sesi cleanup foto lebih besar.', features: ['160 AI Restores', 'Lowest cost per AI Restore', 'Untuk batch experiments'] }
    },
    hero: { eyebrow: 'Harga', description: 'Preview lokal gratis. Beli credits hanya saat ingin AI Restore membuat hasil natural yang lebih kuat.', pillOne: 'Tanpa subscription', pillTwo: '1 credit = 1 AI Restore', pillThree: 'Credits berlaku 12 bulan', panelEyebrow: 'Credit rule', panelTitle: 'Preview gratis tidak memakai biaya. AI Restore memakai credits.', panelText: 'AI job yang gagal mengembalikan credit otomatis, jadi kamu hanya membayar proses yang selesai.' },
    labels: { perRestore: '/ AI Restore', creditRule: '{count} credits · 1 credit = 1 AI Restore' },
    faq: { ...englishDictionary.pricing.faq, title: 'Pertanyaan sebelum membeli credits.', description: 'Jawaban singkat untuk credits, Free preview, AI Restore, expiry, failed jobs, dan refunds.' },
    guardrails: { eyebrow: 'Pricing guardrails', title: 'Credits membeli proses AI Restore.', text: 'AI Restore dapat mengurangi green atau yellow cast, tetapi tidak menjamin rekonstruksi original yang persis. Jika service gagal tanpa hasil, credit yang dipakai dikembalikan otomatis.' },
    creditsHeading: { buy: 'Beli credits hanya saat kamu perlu AI Restore.', remaining: 'Kamu punya {count} credits tersisa.' },
    buyButton: { loading: 'Membuka PayPal...', buy: 'Beli credits', signIn: 'Masuk untuk beli', checkoutError: 'Tidak bisa membuat checkout.', startError: 'Tidak bisa memulai checkout.' }
  },
  myImages: {
    ...englishDictionary.myImages,
    eyebrow: 'Private Matcha Vault',
    title: 'Gambar hasil AI Restore pribadi saya.',
    description: 'Hanya hasil AI Restore yang disimpan di sini. Free preview images tetap di browser dan tidak masuk history.',
    panelEyebrow: 'Privacy first',
    panelTitle: 'Private untuk akun yang sudah masuk.',
    panelText: 'Gambar kamu tidak ditampilkan publik. Kelola completed AI Restore results, download lagi, atau hapus dari history.',
    cards: [
      { title: 'AI Restore results only', text: 'Free preview images tetap lokal di browser dan tidak muncul di gallery.' },
      { title: 'Private account access', text: 'History hanya dimuat setelah Google sign-in dan terbatas untuk akunmu.' },
      { title: 'Download atau delete', text: 'Simpan completed result lagi, atau hapus dari image history.' }
    ],
    gallery: { ...englishDictionary.myImages.gallery, signedOut: { eyebrow: 'Perlu masuk', title: 'Masuk untuk melihat AI restored images kamu.', text: 'Gallery private dan terhubung ke Google account kamu.', cta: 'Masuk dengan Google' }, empty: { eyebrow: 'Belum ada results', title: 'Buat AI Restore result untuk mengisi gallery ini.', text: 'Free previews tetap lokal. Hanya completed AI Restore jobs yang disimpan di sini.', cta: 'Upload foto' }, title: 'Completed AI Restore results', subtitle: '{count} saved images' }
  },
  blog: {
    ...englishDictionary.blog,
    eyebrow: 'Matcha filter blog',
    title: 'Panduan untuk memahami dan mengurangi matcha-style photo filters.',
    description: 'Mulai di sini jika saved photo terlihat terlalu hijau, kuning, muted, atau hazy. Artikel ini menjelaskan filter dan cleanup workflow paling aman.',
    pathTitle: 'Recommended path',
    pathText: 'Proses gratis di browser dulu, lalu pakai 1 credit untuk AI Restore hanya jika basic cleanup belum cukup.',
    posts: [
      { href: '/what-is-matcha-filter', label: 'Definition guide', title: 'Apa Itu Matcha Filter? Penjelasan Green Tint Photo Filter', description: 'Pelajari arti matcha-style filter untuk foto, bagaimana efeknya ke skin tones dan whites, dan kapan cleanup membantu.', cta: 'Baca penjelasan' },
      { href: '/how-to-remove-matcha-filter', label: 'How-to guide', title: 'Cara Remove Matcha Filter from Photo Online', description: 'Ikuti path tercepat: upload saved photo, proses gratis di browser, lalu gunakan AI Restore jika tint perlu koreksi lebih kuat.', cta: 'Baca langkahnya' }
    ]
  },
  feedback: { ...englishDictionary.feedback, button: 'Feedback', title: 'Kirim feedback', description: 'Bug, ide, pujian, atau catatan singkat.', type: 'Tipe feedback', message: 'Pesan kamu', placeholder: 'Apa yang bekerja, apa yang tidak, apa yang kamu inginkan...', contact: 'Email atau handle', optional: 'opsional', contactPlaceholder: 'Agar kami bisa membalas jika perlu', sending: 'Mengirim...', submit: 'Kirim feedback', note: 'Anonim kecuali kamu menambahkan kontak. Halaman saat ini disimpan bersama pesan.', success: 'Terima kasih — feedback terkirim.', error: 'Feedback gagal. Coba lagi.' }
};

// dictionaries 按语言代码聚合所有页面和组件可消费的文案。
export const dictionaries: Record<Locale, Dictionary> = {
  en: englishDictionary,
  fil: filipinoDictionary,
  id: indonesianDictionary
};

// getDictionary 返回目标语言包，未知语言回退英文。
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

// interpolate 将文案模板中的简单占位符替换为运行时业务值。
export function interpolate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
}
