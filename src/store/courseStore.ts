import { createStore } from 'solid-js/store';

const [course, setCourse] = createStore({ modules: [] });

export const updateModules = (modules) => {
    console.log("Saving modules to global state:", modules);
    setCourse("modules", modules);
};

export default course;