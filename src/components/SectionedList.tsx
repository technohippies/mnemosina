import { For } from 'solid-js';
import GeneralList from './GeneralList';

const SectionedList = (props) => {
  return (
    <div>
      <For each={props.sections}>{(section, index) => (
        <div>
          <div class="text-sm mb-2">{index() + 1}</div>
          <GeneralList items={section.items} />
        </div>
      )}</For>
    </div>
  );
};

export default SectionedList;