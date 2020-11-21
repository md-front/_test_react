import React from 'react';
import styles from '../../styles/components/Items/ItemsSection.module.scss';
import {sortByReduction, checkItems, parseDateString} from '../../helpers';
import {updateCurrentSectionData, toggleSectionVisibility} from '../../redux/actions/regions'
import ItemsGroup from './ItemsGroup';
import ToggleSectionsVisibility from './ToggleSectionsVisibility';
import {connect} from "react-redux";

class ItemsSection extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoaded: !!props.groupsEntries,
        }
    }

    componentDidMount() {
        this.props.updateCurrentSectionData(this.props.section);
    }

    visibleVacancies() {
        return this.props.groupsEntries.some(([groupName, group]) => /*!group.is_hidden &&*/ group.items && group.items.length);
    }
    renderItems() {
        /* TODO  "Загрузка" отвалилась?*/
        return !this.state.isLoaded ?
            <div className={styles.loading}>Загрузка <span/></div>
            :
            this.renderItemsOnLoad()
    }
    renderItemsOnLoad() {
        return this.visibleVacancies() ?
            <ItemsGroup groupsEntries={this.props.groupsEntries}
                        key={1}/>
            :
            <h3 key={1}>Подходящих вакансий не найдено, попробуйте изменить запрос или ключевые слова</h3>
    }
    renderSectionsToggle() {
        return this.visibleVacancies() &&
            <ToggleSectionsVisibility sectionId={this.props.section.id}
                                      groupsEntries={this.props.groupsEntries}
                                      key={0} />
    }
    render() {
        return (
            <section className={styles.section}>
                <div className="container">
                    {this.state.isLoaded && [
                        this.renderSectionsToggle(),
                        this.renderItems()
                    ]}
                </div>
            </section>
        );
    }
}


const mapStateToProps = ({form, regions}, {section}) => ({
    section,
    groupsEntries: Object.entries(section.groups),
    name: form.name,
    necessary: form.necessary,
    unnecessary: form.unnecessary,
    newInDays: form.newInDays,
    experience: form.experience,
})

const mapDispatchToProps = {
    updateCurrentSectionData, toggleSectionVisibility
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsSection)