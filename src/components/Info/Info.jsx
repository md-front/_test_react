import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux'
import styles from './Info.module.scss';
import Section from '../Section/Section';
import SectionTitle from "../SectionTitle/SectionTitle";
import {cloneObj} from "../../helpers";

export default function Info() {
    const sections = useSelector(state => cloneObj(state.regions));
    // const sections = useSelector(state => state.regions);
    const activeSection = (() => sections.find(section => section.isActive))();
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
                section.isActive &&
                <Section section={section}
                         key={index} />
            )}
        </main>
    )
}