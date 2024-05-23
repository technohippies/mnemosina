// Assuming i18next is initialized in your SolidJS project and you want to integrate it with Storybook
import '../src/i18n'; // Import your i18n setup
import i18n from 'i18next';
import '../src/index.css'; // Assuming you have global CSS you want to include

// Define global types for Storybook, including the locale switcher
export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en', // Default language
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', title: 'English' },
        { value: 'ja', title: 'Japanese' },
        { value: 'ko', title: 'Korean' },
        { value: 'zh-CN', title: 'Mandarin' },
      ],
      showName: true,
    },
  },
};

// Adjusting for SolidJS: Ensure your Storybook setup can handle SolidJS components correctly
export const decorators = [
  (StoryFn, context) => {
    const { globals: { locale } } = context;
    i18n.changeLanguage(locale);
    // Render the story component, adjusting for SolidJS as necessary
    // This might need adjustment based on your specific setup or SolidJS version
    return StoryFn();
  },
];