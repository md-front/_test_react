import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux'
import styles from '../styles/components/Info.module.scss';
import Section from './Info/Section';
import SectionTitle from "./Info/SectionTitle";

export default function Info() {
    const sections = useSelector(state => state.regions);
    const activeSection = (() => sections.find(section => section.is_active))();
    const [activeTitleId, setActiveTitle] = useState(activeSection.id);

    useEffect(() => setActiveTitle(activeSection.id), [activeSection]);

    return (
        <main>
            <div className="container">
                <div className={styles.nav}>
                    {sections.map((section, index) =>
                        section.checked &&
                        <SectionTitle section={section}
                                    activeTitleId={activeTitleId}
                                    key={index} />
                    )}
                </div>
            </div>
            {sections.map((section, index) =>
                section.is_active &&
                <Section section={section}
                              key={index} />
            )}
        </main>
    )
}