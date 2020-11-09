import React from 'react';
import { render, screen } from '@testing-library/react';
import ItemsVacancy from './ItemsVacancy';

const vacancyData = {"id":"39372547","premium":false,"name":"Frontend-разработчик","department":null,"has_test":false,"response_letter_required":false,"area":{"id":"3","name":"Екатеринбург","url":"https://api.hh.ru/areas/3"},"salary":null,"type":{"id":"open","name":"Открытая"},"address":{"city":"Екатеринбург","street":"улица Татищева","building":"49а","description":null,"lat":56.834939,"lng":60.563321,"raw":"Екатеринбург, улица Татищева, 49а","metro":null,"metro_stations":[],"id":"228490"},"response_url":null,"sort_point_distance":null,"employer":{"id":"42600","name":"NAUMEN","url":"https://api.hh.ru/employers/42600","alternate_url":"https://hh.ru/employer/42600","logo_urls":{"90":"https://hhcdn.ru/employer-logo/3449977.png","240":"https://hhcdn.ru/employer-logo/3449978.png","original":"https://hhcdn.ru/employer-logo-original/752254.png"},"vacancies_url":"https://api.hh.ru/vacancies?employer_id=42600","trusted":true},"published_at":"2020-11-02T18:51:31+0300","created_at":"2020-11-02T18:51:31+0300","archived":false,"apply_alternate_url":"https://hh.ru/applicant/vacancy_response?vacancyId=39372547","insider_interview":null,"url":"https://api.hh.ru/vacancies/39372547?host=hh.ru","alternate_url":"https://hh.ru/vacancy/39372547","relations":[],"snippet":{"requirement":"Знакомство с основными понятиями ES6. А также знание любого современного <highlighttext>Frontend</highlighttext>-фреймворка. Работа с Git. Работа с командной строкой...","responsibility":"Развитие библиотеки React-компонентов. Улучшение текущей кодовой базы и подходов в разработке. Разработка прототипов. Есть возможность получить компетенции в направлении..."},"contacts":null,"schedule":{"id":"fullDay","name":"Полный день"},"working_days":[],"working_time_intervals":[],"working_time_modes":[],"accept_temporary":false,"sort":{"name":"default","value":0}}

xit('Рендер вакансии', () => {
    const tree = render(<ItemsVacancy vacancy={vacancyData} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});


