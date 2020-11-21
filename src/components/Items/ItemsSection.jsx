import React from 'react';
import styles from '../../styles/components/Items/ItemsSection.module.scss';
import {sortByReduction, checkItems, parseDateString} from '../../helpers';
import {updateCurrentSectionData, toggleSectionVisibility} from '../../redux/actions/regions'
import ItemsGroup from './ItemsGroup';
import ToggleSectionsVisibility from './ToggleSectionsVisibility';
import {connect} from "react-redux";

/* todo ? вынести эти параметры из всех компонентов глобально? */
const ACTION_TYPES = {
    favorites: 'is_fav',
    blacklist: 'is_del',
}

class ItemsSection extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoaded: !!props.groupsEntries,
            // vacancies: props.section.vacancies || []
        }

        // this.favoritesAction = this.favoritesAction.bind(this);
        // this.blacklistAction = this.blacklistAction.bind(this);
        // this.filterToggleItem = this.filterToggleItem.bind(this);
    }

    componentDidMount() {

        // console.log('mount')

        this.props.updateCurrentSectionData(this.props.section);
    }
    componentDidUpdate(prevAllProps) {

        // console.log('update')

        // const ACTIONS = [
        //     {
        //         name: 'favorites',
        //         init: this.favoritesAction
        //     },
        //     {
        //         name: 'blacklist',
        //         init: this.blacklistAction
        //     },
        // ]
        //
        // /* todo ? стоит как-то вынести за componentDidUpdate? */
        // ACTIONS.forEach(action => this.activityCheck(action, prevAllProps));
    }

    /** Actions */
    // activityCheck(action, prevAllProps){
    //     /** del - {вакансия: item} / fav - {item: группа} / filter - {группа} */
    //     const prevProps = prevAllProps[action.name][this.props.section.id];
    //     const actualProps = this.props[action.name][this.props.section.id];
    //
    //     /** id элементов */
    //     const prevIds = Object.keys(prevProps);
    //     const actualIds = Object.keys(actualProps);
    //
    //     if(prevIds.length === actualIds.length) return;
    //
    //     /* todo ? убрать if и всё проходить фильтром, стоит ли? */
    //     if(prevIds.length > actualIds.length) {
    //         const changedIds = prevIds.filter(id => !actualIds.includes(id));
    //
    //         changedIds.forEach(changedId => {
    //             const parentId = prevProps[changedId];
    //
    //             action.init(action.name, changedId, parentId, false)
    //         })
    //     } else {
    //         const changedId = actualIds.find(vacancyId => !prevIds.includes(vacancyId));
    //         const parentId = actualProps[changedId];
    //
    //         action.init(action.name, changedId, parentId, true);
    //     }
    // }
    // favoritesAction(type, id, parentId, isAdding) {
    //     let groups = [...this.state.groups];
    //     let prevGroup;
    //     let newGroup;
    //     let item;
    //     let itemIndex;
    //
    //     /* todo ? избавился от лишних if'ов, но выглядит довольно убого */
    //     const PARAMS = {
    //         adding: {
    //             parentId: parentId,
    //             newGroupId() {
    //                 return FAVORITE_SORT_VALUE
    //             },
    //             createNewGroup() {
    //                 return this.createGroup("is_fav", FAVORITE_SORT_VALUE);
    //             }
    //         },
    //         removing: {
    //             parentId: FAVORITE_SORT_VALUE,
    //             newGroupId(item) {
    //                 return item.sort.value
    //             },
    //             createNewGroup() {
    //                 return this.createGroup(item.sort.name, item.sort.value);
    //             }
    //         }
    //     }
    //
    //     const currentParams = isAdding ? PARAMS['adding'] : PARAMS['removing'];
    //
    //     prevGroup = groups.find(group => group.sortValue === currentParams.parentId);
    //
    //     if(!prevGroup) return;
    //
    //     item = prevGroup.items.find((item, index) => {
    //         itemIndex = index;
    //         return item.id === id;
    //     })
    //
    //     if(!item) return;
    //
    //     newGroup = groups.find(group => group.sortValue === currentParams.newGroupId(item));
    //
    //     if(!newGroup) {
    //         newGroup = currentParams.createNewGroup.call(this);
    //         groups.push(newGroup);
    //     }
    //
    //     item.is_fav = isAdding;
    //
    //     newGroup.items.push(item);
    //
    //     prevGroup.items.splice(itemIndex, 1);
    //
    //     newGroup.haveVisibleItem = checkItems(newGroup.items, 'haveVisibleItem');
    //     prevGroup.haveVisibleItem = checkItems(prevGroup.items, 'haveVisibleItem');
    //
    //     groups = sortByReduction(groups, 'sortValue');
    //
    //     this.updateData({groups})
    // }
    // blacklistAction(type, id, parentId) {
    //     let groups = [...this.state.groups];
    //     let vacancies = [...this.state.vacancies];
    //
    //     const vacancy = vacancies.find(vacancy => vacancy.id === id);
    //
    //     if(!vacancy) return;
    //
    //     vacancy[ACTION_TYPES[type]] = !vacancy[ACTION_TYPES[type]];
    //
    //     /** Группа работодателей по типу */
    //     let prevGroup;
    //     let item;
    //     let itemIndex;
    //
    //     /* todo переделать на parentId - section.id, избежать обхода всех items */
    //     for(let group of groups) {
    //         let tempIndex;
    //         item = group.items.find((item, index) => {
    //             tempIndex = index;
    //             return item.id === parentId;
    //         });
    //
    //         if(item) {
    //             itemIndex = tempIndex;
    //             prevGroup = group;
    //             break;
    //         }
    //     }
    //
    //     item.haveVisibleItem = checkItems(item.items, 'is_del', false);
    //
    //     let topVacancySort = DEFAULT_SORT;
    //
    //     item.items.forEach(vacancy => {
    //         if(!vacancy.is_del && vacancy.sort.value > topVacancySort.value)
    //             topVacancySort = vacancy.sort;
    //     })
    //
    //     /** Изменение текущей группы */
    //     if(!item.is_fav && item.sort.value !== topVacancySort.value) {
    //         item.sort = topVacancySort;
    //
    //         let newGroup = groups.find(group => group.sortValue === item.sort.value);
    //
    //         if(!newGroup) {
    //             newGroup = this.createGroup(item.sort.name, item.sort.value);
    //             groups.push(newGroup);
    //         }
    //
    //         newGroup.items.push(item);
    //
    //         prevGroup.items.splice(itemIndex, 1);
    //
    //         newGroup.haveVisibleItem = checkItems(newGroup.items, 'haveVisibleItem');
    //     }
    //
    //     prevGroup.haveVisibleItem = checkItems(prevGroup.items, 'haveVisibleItem');
    //
    //     groups = sortByReduction(groups, 'sortValue');
    //
    //     this.updateData({vacancies, groups})
    // }

    /** Render */
    /*renderFilterGroups() {
        return (
            <div className={styles.filter}>
                <div className={styles.title}>Отображение групп:</div>
                {this.props.groupsEntries.map(([groupId,group],index) =>
                    (group.items && group.items.length) ?
                        <button type="button"
                                className={group.is_hidden ? styles.filterItem : styles.filterItemActive}
                                onClick={() => this.props.toggleSectionVisibility(this.props.sectionId, groupId)}
                                key={index}>{group.name}</button>
                        :
                        ''
                )}
            </div>
        )
    }*/
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
        return this.visibleVacancies() ?
            <ToggleSectionsVisibility sectionId={this.props.section.id}
                                      groupsEntries={this.props.groupsEntries}
                                      key={0} />
            :
            ''
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