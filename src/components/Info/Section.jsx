import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/components/Info/Section.module.scss';
import {declOfNum} from '../../helpers';
import {loadData, toggleGroupVisibility} from '../../redux/actions/regions'
import Groups from './Groups';
import ToggleGroupsVisibility from './ToggleGroupsVisibility';
import {connect} from "react-redux";

class Section extends React.Component {

    constructor(props) {
        super(props);

        /* TODO переделать на простой компонент */
        this.state = {
        }
    }

    componentDidMount() {
        this.props.loadData(this.props.section);
    }

    render() {
        return (
            <section className={styles.section}>
                <div className="container">
                    {!this.props.section.allVacancies ?
                        this.renderLoading()
                        :
                        [
                            this.renderGroupsToggle(),
                            this.renderGroups()
                        ]
                    }
                </div>
            </section>
        );
    }

    renderLoading() {
        const isFewExp = this.props.experience.filter(exp => exp.checked).length > 1;
        const fewExp = <span className={styles.fewExpAlert}>(На группировку двух и более секций опыта потребуется больше времени)</span>

        return <h3 className={styles.alert}>Загрузка...{isFewExp && fewExp}</h3>
    }
    renderGroupsToggle() {
        return this.props.section.vacancies.length > 0 &&
            <ToggleGroupsVisibility sectionId={this.props.section.id}
                                      groupsEntries={this.props.groupsEntries}
                                      key={0} />
    }
    renderGroups() {
        return this.props.section.visibleVacancies ?
            <Groups groupsEntries={this.props.groupsEntries}
                        key={1}/>
            :
            <h3 key={1}>{this.alertText()}</h3>
    }
    alertText() {
        const allVacancies = this.props.section.allVacancies.length;
        const declension = declOfNum(allVacancies, [['найдена','вакансия','скрыта'],['найдено','вакансии','скрыты'],['найдено','вакансий','скрыты']]);


        return allVacancies ?
            `По вашему запросу ${declension[0]} ${allVacancies} ${declension[1]} но ${declension[2]} из-за "ключевых слов"${this.props.section.vacancies.length > 0 ? ' или "отображения групп"' : ''}`
            :
            `По вашему запросу вакансии не найдены, попробуйте изменить "название", "регион поиска" или добавить поля "опыта"`
    }
}


const mapStateToProps = ({form}, {section}) => ({
    section,
    groupsEntries: Object.entries(section.groups),
    experience: form.experience,
})

const mapDispatchToProps = {
    loadData, toggleGroupVisibility
}

Section.propTypes = {
    section: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Section)