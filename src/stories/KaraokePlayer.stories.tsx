import { Component } from 'solid-js';
import KaraokePlayer from '../components/KaraokePlayer';

const Template: Component<{
  videoId: string;
  subtitles: Array<{
    language: string;
    src: string;
    segments: Array<{
      start: number;
      end: number;
      text: string;
    }>;
  }>;
  playbackSpeed?: number;
}> = (args) => <KaraokePlayer {...args} />;

export const WithTwoSubtitleTracks = Template.bind({});
WithTwoSubtitleTracks.args = {
  videoId: 'wD_ZXVNkYmw',
  subtitles: [
    // Example subtitles structure; adjust `src` as needed
    {
      language: 'English',
      src: 'path/to/english/subtitles.vtt',
      segments: [
        { start: 0, end: 2, text: 'Hello world' },
        { start: 2, end: 4, text: 'This is a test' },
        { start: 4, end: 6, text: 'SolidJS is awesome' },
      ],
    },
    {
      language: 'Chinese',
      src: 'path/to/chinese/subtitles.vtt',
      segments: [
        { start: 0, end: 2, text: '你好，世界' },
        { start: 2, end: 4, text: '这是一个测试' },
        { start: 4, end: 6, text: 'SolidJS 很棒' },
      ],
    },
  ],
  playbackSpeed: 1.0,
};

export default {
  title: 'Components/KaraokePlayer',
  component: KaraokePlayer,
};