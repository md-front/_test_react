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
                    <h3>В данный момент забираются вакансии с hh.ru по следующим принципам:</h3>
                    <ul>
                        <li>Текст поиска - "frontend"; <span className={styles.wip} title='Планируется вывод информации на основе ввода пользователя'>WIP</span></li>
                        <li>
                            Локации поиска: <span className={styles.wip} title='Планируется вывод информации на основе ввода пользователя'>WIP</span>
                            <ul>
                                <li><i>Екатеринбург, Удалённая работа</i></li>
                            </ul>
                        </li>
                        <li>
                            Вакансии фильтруется на наличие ключевых слов в названии: <span className={styles.wip} title='Планируется вывод информации на основе ввода пользователя'>WIP</span>
                            <ul>
                                <li><i>front|фронт|js|javascript</i></li>
                            </ul>
                        </li>
                        <li>
                            Так же название вакансии не должно содержать: <span className={styles.wip} title='Планируется вывод информации на основе ввода пользователя'>WIP</span>
                            <ul>
                                <li><i>backend|fullstack|SQL|lead|ведущий|angular</i></li>
                            </ul>
                        </li>
                        <li>
                            Вакансии группируются по работодателям;
                        </li>
                        <li>
                            Работодатели дополнительно группируются по следующим приоритетам:
                            <ul>
                                <li>
                                    <span className={styles.fav}>Избранное</span> - формируются при наличии id работодателя соответствующей записи в localStorage;
                                </li>
                                <li>
                                    <span className={styles.new}>Содержит новые вакансии</span>
                                    - формируются из работодателей, имеющих размещённую вакансию за последние сутки;
                                </li>
                                <li>
                                    <span className={styles.jun}>Содержит вакансии для начинающих</span>
                                    - формируются из работодателей, содержащих вакансию с кейвордами <i>junior|стажер|младший</i>, в группах с высшим приоритетом данные работодатели выделены <span>зеленым заголовком</span>;
                                </li>
                                <li>
                                    <span className={styles.salary}>Содержит вакансии с указанным окладом</span>
                                    - вакансии с указанным окладом в группе с высшим приоритетом имеют символ <span>"$"</span>
                                </li>
                                <li>
                                    <span className={styles.default}>Без особых параметров</span>
                                </li>
                                <li>
                                    <span>Скрытые вакансии (не отображаются)</span> - формируются при наличии id вакансии соответствующей записи в localStorage;
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className={styles.item}>
                    <h3>Взаимодействие:</h3>
                    <ul>
                        <li>
                            <span>По клику на заголовок регионов переключение между ними;</span>
                            <ul>
                                <li>Запрашиваются у сервера и выводятся соответствующие вакансии;</li>
                                <li>Количество валидных вакансий отображается в заголовке;</li>
                            </ul>
                        </li>
                        <li>
                            <span>Клик по заголовку работодателя добавляет его в "избранное";</span>
                            <ul>
                                <li>Если группы избранного нет - создаётся;</li>
                                <li>Создаётся соответствующая запись в localStorage;</li>
                            </ul>
                        </li>
                        <li>
                            <span>По клику "Очистить избранное";</span>
                            <ul>
                                <li>Все работодатели распределяются из избранного по группам в соответствии вакансии с наивысшем приоритетом;</li>
                                <li>Избранное в localStorage очищается;</li>
                            </ul>
                        </li>
                        <li>
                            <span>При наведении на вакансию;</span>
                            <ul>
                                <li>Отображается иконка "удаления" вакансии;</li>
                                <li>Отображается информация о вакансии: Оклад (при наличии), а так же краткое описание (при наличии > 100 символов, если описание содержит поисковый запрос - он будет подсвечен в тексте);</li>
                            </ul>
                        </li>
                        <li>
                            <span>По клику на иконку корзины вакансии;</span>
                            <ul>
                                <li>Вакансия скрывается;</li>
                                <li>Если других вакансий у работодателя нет - скрывается;</li>
                                <li>При наличии других вакансий у работодателя - остаётся в текущей группе / переносится в другую в соответствии с оставшейся вакансии с наивысшем приоритетом;</li>
                                <li>Создаётся соответствующая запись в localStorage;</li>
                            </ul>
                        </li>
                        <li>
                            <span>По клику "Вернуть скрытые вакансии";</span>
                            <ul>
                                <li>Все ранее скрытые вакансии отображаются в соответствующих группах;</li>
                                <li>Скрытые вакансии удаляются из localStorage;</li>
                            </ul>
                        </li>
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
