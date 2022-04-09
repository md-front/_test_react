import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styles from './Alert.module.scss';
import { hideAlert } from '../../redux/actions/app';
import { AlertProps } from './Alert.types';

function Alert(props: AlertProps) {
  // TODO
  const alertRef: any = React.createRef();

  useEffect(() => {
    const alertClickOutside = (e: Event) => {
      const alert = alertRef?.current;

      if (alert && !alert.contains(e.target)) {
        props.hideAlert(e);
      }
    };

    const closeByEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') props.hideAlert(e);
    };

    document.addEventListener('keydown', closeByEsc);
    document.addEventListener('click', alertClickOutside);

    return () => {
      // componentWillUnmount
      document.removeEventListener('keydown', closeByEsc);
      document.removeEventListener('click', alertClickOutside);
    };
  }, [alertRef, props]);

  return (
    <div
      className={styles.alert}
      ref={alertRef}
    >
      <h2>Описание функционала:</h2>

      <button
        type="button"
        label="hideAlert"
        className={styles.close}
        // @ts-ignore
        onClick={props.hideAlert}
      />

      <div className={styles.item}>
        <h3>Вакансии выводятся с hh.ru в соответствии с настраиваемым фильтром:</h3>
        <ul>
          <li>
            Поля формы &quot;заголовок вакансии&quot;, &quot;регионы поиска&quot;, &quot;
            рассматриваемый опыт работы&quot; - формируют поисковый запрос.
          </li>
          <li>
            Поля &quot;ключевых слов&quot;, &quot;исключающих ключевых слов&quot; и &quot;
            за какое время учитывать &quot;новые&quot; вакансии&quot; - &quot;реактивны&quot;
            и позволяют фильтровать вакансии без дополнительных запросов к серверу и перезагрузки страницы.
          </li>
          <li>Отфильтрованный список вакансий группируется по компаниям;</li>
          <li>Компании дополнительно группируются по следующим приоритетам:</li>
          <li>
            <span style={{ color: '#fccea6' }}>Избранное</span>
            {' '}
            - формируются при соответствии id компании записи в localStorage;
          </li>
          <li>
            <span style={{ color: '#f49c9c' }}>Новые</span>
            {' '}
            - формируются из компаний, имеющих минимум одну вакансию,
            размещенную за заданное в фильтре количество дней
            {' '}
            <i>(в группе с высшим приоритетом вакансия имеет пометку &quot;NEW&quot;)</i>
            ;
          </li>
          <li>
            <span style={{ color: '#a0acf6' }}>Опыт &quot;&gt;&quot; 6 лет</span>
            {' '}
            - формируются из компаний, имеющих минимум одну вакансию с требуемым опытом &gt; 6 лет;
          </li>
          <li>
            <span style={{ color: '#a3d0f3' }}>Опыт 3-6 лет</span>
            {' '}
            - формируются из компаний, имеющих минимум одну вакансию с требуемым опытом 3-6 лет;
          </li>
          <li>
            <span style={{ color: '#88e7d6' }}>Для начинающих</span>
            {' '}
            - формируются из компаний,
            имеющих минимум одну вакансию с требуемым опытом до 1 года или содержащих вакансию с кейвордами
            {' '}
            <i>junior|стажер|младший</i>
            ;
          </li>
          <li>
            <span style={{ color: '#abd59f' }}>1-3 с указанным окладом</span>
            {' '}
            - формируются из компаний, имеющих минимум одну вакансию с требуемым опытом 1-3 года и указанным окладом
            {' '}
            <i>(в группе с высшим приоритетом вакансия имеет символ &quot;$&quot;)</i>
            ;
          </li>
          <li>
            <span style={{ color: '#b3b3b3' }}>Опыт 1-3 года</span>
            {' '}
            - вакансии без дополнительных параметров;
          </li>
          <li>
            <span>
              Скрытые вакансии
              <i>(не отображаются)</i>
            </span>
            {' '}
            - формируются при соответствии id вакансии записи в localStorage;
          </li>

        </ul>
      </div>
      <div className={styles.item}>
        <h3>Возможное взаимодействие:</h3>
        <ul>
          <li>Формирование поискового запроса с учетом нескольких регионов и групп опыта;</li>
          <li>
            &quot;Реактивная&quot; фильтрация всего пула вакансий на основании ключевых слов
            _(название вакансии или работодателя будут содержать хотя-бы одно из ключевых слов или исключать слова)_;
          </li>
          <li>Возможность скопировать ссылку на поиск с предустановленными параметрами;</li>
          <li>Переключение между регионами по клику на заголовок;</li>
          <li>
            Переключение отображения групп компаний
            <i>(избранное, новые и тд)</i>
            ;
          </li>
          <li>Добавление компании в избранное по клику на её заголовок;</li>
          <li>
            Отображение краткой информации о вакансии при наведении:
            <li>
              оклад, если на странице есть зп в $ то у всех вакансий будет указан оклад и в долларах и в рублях
              <i>(рассчитывается согласно актуальному курсу, валюта зп выделена цветом)</i>
              ;
            </li>
            <li>краткое описание, при наличии;</li>
          </li>
          <li>
            Скрытие вакансии по клику на иконку глаза
            <i>(отображается при наведении на вакансию)</i>
            ;
          </li>
          <li>Очистка &quot;избранных&quot; и скрытых компаний по клику на кнопки вверху страницы;</li>
        </ul>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  hideAlert,
};

export default connect(null, mapDispatchToProps)(Alert);
