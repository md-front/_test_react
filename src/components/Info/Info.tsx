import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './Info.module.scss';
import { Section } from '../Section';
import { SectionTitle } from '../SectionTitle';
import { cloneObj } from '../../helpers';
import { Section as SectionType } from '../Section/Section.types';
import { InfoState } from './Info.types';
import { Regions } from '../../types/initialParams.types';

export default function Info() {
  const sections: Regions = useSelector((state: InfoState) => cloneObj(state.regions));
  const activeSection = (() => sections.find((section: SectionType) => section.isActive))();
  const [activeTitleId, setActiveTitle] = useState(activeSection!.id);

  useEffect(
    () => setActiveTitle(activeSection!.id),
    [activeSection],
  );

  return (
    <main>
      <div className="container">
        <div className={styles.nav}>
          {sections.map((section) => section.checked
            && (
              <SectionTitle
                section={section}
                activeTitleId={activeTitleId}
                key={section.id}
              />
            ))}
        </div>
      </div>
      {sections.map((section) => section.isActive
        && (
          <Section
            section={section}
            key={section.id}
          />
        ))}
    </main>
  );
}
