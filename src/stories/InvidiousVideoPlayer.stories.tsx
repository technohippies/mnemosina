import { Component } from 'solid-js';
import InvidiousVideoPlayer from '../components/InvidiousVideoPlayer';

const meta = {
    title: 'Components/InvidiousVideoPlayer',
    component: InvidiousVideoPlayer,
};

export default meta;

export const Default = () => {
    return (
        <InvidiousVideoPlayer videoId="EcPsB6PwaiE" />
    );
};