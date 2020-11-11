import React from 'react';
import {cloneObj} from '../helpers';
import {ReactComponent as More} from '../assets/search-more.svg'
import styles from '../styles/components/Form.module.scss';

export default class Form extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showMore: true,
            ...this.props.searchParams
        };

        this.clear = this.clear.bind(this);
        this.toggle = this.toggle.bind(this);
        this.submit = this.submit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.setDefaultParams = this.setDefaultParams.bind(this);
    }

    toggle() {
        this.setState({showMore: !this.state.showMore})
    }

    handleChange(e) {
        this.setState({[e.target.id]: e.target.value})
    }

    handleClick(e) {
        const regions = cloneObj(this.state.regions);
        const region = regions.find(region => region.id === e.target.id);
        region.checked = !region.checked;

        if(region.is_active)
            region.is_active = false;

        this.setState({regions})
    }

    submit(e) {
        e.preventDefault();

        this.props.search({
            name: this.state.name,
            necessary: this.state.necessary,
            unnecessary: this.state.unnecessary,
            regions: this.state.regions,
        })
    }

    clear() {
        this.setState({
            name: '',
            necessary: '',
            unnecessary: '',
        })
    }

    setDefaultParams() {
        console.log('setDefaultParams')
    }

    render() {
        return (
            <form className={styles.form}
                  onSubmit={this.submit}>
                <label htmlFor="name" className={styles.label}>Вакансия:</label>
                <div className={styles.top}>
                    <input className={styles.input}
                           type="text"
                           placeholder="Менеджер"
                           id="name"
                           value={this.state.name}
                           onChange={this.handleChange}/>
                    <button className={styles.submit}
                            type="submit">Найти</button>
                </div>

                <button type="button"
                        className={styles.toggle}
                        onClick={this.toggle}>
                    <More/>
                </button>

                <button type="button"
                        onClick={this.setDefaultParams}>
                    Подставить стандартный поиск
                </button>

                <button type="button"
                        onClick={this.clear}>
                    Очистить
                </button>

                <div className={this.state.showMore ? styles.inner : styles.hidden}>
                    <label htmlFor="necessary" className={styles.label}>Необходимые ключевые слова <i>(через запятую)</i>:</label>
                    <label htmlFor="unnecessary" className={styles.label}>Ключевые слова которых быть не должно <i>(через запятую)</i>:</label>
                    <input className={styles.input}
                           type="text"
                           id="necessary"
                           placeholder="управлению, кадрам"
                           value={this.state.necessary}
                           onChange={this.handleChange}/>

                    <input className={styles.input}
                           type="text"
                           id="unnecessary"
                           placeholder="продажам, работе с клиентами"
                           value={this.state.unnecessary}
                           onChange={this.handleChange}/>

                   <div className="div">
                       <div className={styles.label}>Регионы поиска:</div>

                       {this.state.regions.map((region, index) =>
                           <label key={index}>
                               <input type="checkbox"
                                      checked={region.checked}
                                      onChange={this.handleClick}
                                      id={region.id}/>
                               <span>{region.name}</span>
                           </label>
                       )}


                   </div>
                </div>
            </form>
        );
    }
}
