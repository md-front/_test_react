import React from 'react';
import styles from '../styles/components/Alert.module.scss';
import {hideAlert} from "../redux/actions/app";
import {connect} from "react-redux";

class Alert extends React.Component {
    constructor(props) {
        super(props);

        this.alertRef = React.createRef();

        this.closeByEsc = this.closeByEsc.bind(this);
        this.alertClickOutside = this.alertClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.closeByEsc);
        document.addEventListener('click', this.alertClickOutside);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.closeByEsc);
        document.removeEventListener('click', this.alertClickOutside);
    }

    alertClickOutside(e) {
        const alert = this.alertRef.current;

        if (alert && !alert.contains(e.target))
            this.props.hideAlert(e);
    }
    closeByEsc(e) {
        if(e.key === 'Escape')
            this.hideAlert(e);
    }

    render() {
        return (
            <div className={styles.alert}
                 ref={this.alertRef}>
                <h2>Описание функционала:</h2>

                <button className={styles.close}
                        onClick={this.props.hideAlert} />

                <div className={styles.item}>
                    <h3>Вакансии выводятся с hh.ru в соответствии с настраиваемым фильтром:</h3>
                    <ul>
                        <li>Поля формы "заголовок вакансии", "регионы поиска", "рассматриваемый опыт работы" - формируют поисковый запрос.</li>
                        <li>Поля "ключевых слов", "исключающих ключевых слов" и "за какое время учитывать 'новые' вакансии" - "реактивны" и позволяют фильтровать вакансии без дополнительных запросов к серверу и перезагрузки страницы.</li>
                        <li>Отфильтрованный список вакансий группируется по компаниям;</li>
                        <li>Компании дополнительно группируются по следующим приоритетам:</li>
                        <li><span style={{color:'#fccea6'}}>Избранное</span> - формируются при соответствии id компании записи в localStorage;</li>
                        <li><span style={{color:'#f49c9c'}}>Новые</span> - формируются из компаний, имеющих минимум одну вакансию, размещенную за заданное в фильтре количество дней <i>(в группе с высшим приоритетом вакансия имеет пометку "NEW")</i>;</li>
                        <li><span style={{color:'#a0acf6'}}>Опыт ">" 6 лет</span> - формируются из компаний, имеющих минимум одну вакансию с требуемым опытом > 6 лет;</li>
                        <li><span style={{color:'#a3d0f3'}}>Опыт 3-6 лет</span> - формируются из компаний, имеющих минимум одну вакансию с требуемым опытом 3-6 лет;</li>
                        <li><span style={{color:'#88e7d6'}}>Для начинающих</span> - формируются из компаний, имеющих минимум одну вакансию с требуемым опытом до 1 года или содержащих вакансию с кейвордами <i>junior|стажер|младший</i>;</li>
                        <li><span style={{color:'#abd59f'}}>1-3 с указанным окладом</span> - формируются из компаний, имеющих минимум одну вакансию с требуемым опытом 1-3 года и указанным окладом <i>(в группе с высшим приоритетом вакансия имеет символ "$")</i>;</li>
                        <li><span style={{color:'#b3b3b3'}}>Опыт 1-3 года</span> - вакансии без дополнительных параметров;</li>
                        <li><span>Скрытые вакансии <i>(не отображаются)</i></span> - формируются при соответствии id вакансии записи в localStorage;</li>


                    </ul>
                </div>
                <div className={styles.item}>
                    <h3>Возможное взаимодействие:</h3>
                    <ul>
                        <li>Формирование поискового запроса с учетом нескольких регионов и групп опыта;</li>
                        <li>"Реактивная" фильтрация всего пула вакансий на основании ключевых слов _(название вакансии или работодателя будут содержать хотя-бы одно из ключевых слов или исключать слова)_;</li>
                        <li>Возможность скопировать ссылку на поиск с предустановленными параметрами;</li>
                        <li>Переключение между регионами по клику на заголовок;</li>
                        <li>Переключение отображения групп компаний <i>(избранное, новые и тд)</i>;</li>
                        <li>Добавление компании в избранное по клику на её заголовок;</li>
                        <li>
                            Отображение краткой информации о вакансии при наведении:
                            <li>оклад, если на странице есть зп в $ то у всех вакансий будет указан оклад и в долларах и в рублях <i>(рассчитывается согласно актуальному курсу, валюта зп выделена цветом)</i>;</li>
                            <li>краткое описание, при наличии;</li>
                        </li>
                        <li>Скрытие вакансии по клику на иконку глаза <i>(отображается при наведении на вакансию)</i>;</li>
                        <li>Очистка "избранных" и скрытых компаний по клику на кнопки вверху страницы;</li>
                    </ul>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = {
    hideAlert
}

export default connect(null, mapDispatchToProps)(Alert)
