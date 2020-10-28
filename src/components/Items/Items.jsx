import React from 'react';
import styles from '../../styles/components/Items/Items.module.scss';
import ItemsSection from './ItemsSection';
import ItemsTitle from "./ItemsTitle";


export default class extends React.Component {

    constructor(props) {
        super(props);

        this.props.locations[0].is_active = true;

        this.state = {
            sections: this.props.locations,
            activeSectionId: this.props.locations[0].id,
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

        this.setState({ sections , activeSectionId: id });
    }
    /* todo ? приемлемо ли апдейтить стейт из дочернего компонента? (кажется что нет) */
    handleLoaded(id, loadedData) {
        const sections = this.state.sections;
        const activeSection = sections.find(section => section.id === id);

        for(let i in loadedData)
            activeSection[i] = loadedData[i]

        this.setState({ sections });
    }

    render() {
        return (
            <main>
                <div className={ styles.nav }>
                    { this.state.sections.map((section, index) =>
                        <ItemsTitle section={ section }
                                    quantity={ this.state.activeQuantity }
                                    handleClick={ this.handleClickSectionTitle }
                                    key={ index } />
                    )}
                </div>
                { this.state.sections.map((section, index) =>
                    section.is_active &&
                    <ItemsSection section={ section }
                                  key={ index }
                                  handleLoaded={ this.handleLoaded }
                                  handleClickAction={ this.props.handleClickAction }
                                  favorites={ this.props.favorites }
                                  blacklist={ this.props.blacklist } />
                )}
            </main>
        );
    }
}
