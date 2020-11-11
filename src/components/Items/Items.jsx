import React from 'react';
import styles from '../../styles/components/Items/Items.module.scss';
import ItemsSection from './ItemsSection';
import ItemsTitle from "./ItemsTitle";


export default class extends React.Component {

    constructor(props) {
        super(props);

        const regions = this.props.searchParams.regions;

        regions[0].is_active = true;

        this.state = {
            sections: regions,
            activeSectionId: regions[0].id,
        }

        this.handleLoaded = this.handleLoaded.bind(this);
        this.handleClickSectionTitle = this.handleClickSectionTitle.bind(this);
    }

    handleClickSectionTitle(id) {
        const sections = this.state.sections;
        let activeSection;
        let prevActiveSection;

        for(let section of sections) {
            if(section.id === id)
                activeSection = section;

            if(section.id === this.state.activeSectionId)
                prevActiveSection = section;

            if(activeSection && prevActiveSection)
                break;
        }

        activeSection.is_active = true;
        prevActiveSection.is_active = false;

        this.setState({sections , activeSectionId: id});
    }
    /* todo ? приемлемо ли апдейтить стейт из дочернего компонента? (кажется что нет) */
    handleLoaded(id, loadedData) {
        const sections = this.state.sections;
        const activeSection = sections.find(section => section.id === id);

        console.log('handleLoaded', activeSection, loadedData)

        for(let i in loadedData)
            activeSection[i] = loadedData[i]

        this.setState({sections});
    }

    render() {
        return (
            <main>
                <div className="container">
                    <div className={styles.nav}>
                        {this.state.sections.map((section, index) =>
                            <ItemsTitle section={section}
                                        quantity={this.state.activeQuantity}
                                        handleClick={this.handleClickSectionTitle}
                                        key={index} />
                        )}
                    </div>
                </div>
                {this.state.sections.map((section, index) =>
                    section.is_active &&
                    <ItemsSection section={section}
                                  key={index}
                                  searchParams={this.props.searchParams}
                                  handleLoaded={this.handleLoaded}
                                  handleClickAction={this.props.handleClickAction}
                                  filtered={this.props.filtered[section.id]}
                                  favorites={this.props.favorites}
                                  blacklist={this.props.blacklist} />
                )}
            </main>
        );
    }
}
