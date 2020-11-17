const DEFAULT_SEARCH_PARAMS = {
    name: 'Frontend',
    necessary: ['front', 'фронт', 'js', 'javascript', 'react'],
    unnecessary: ['backend', 'fullstack', 'SQL', 'lead', 'ведущий', 'angular'],
    newInDays: 1,
    experience: [
        {
            'id': 'noExperience',
            'name': 'Нет опыта',
            'checked': true,
        },
        {
            'id': 'between1And3',
            'name': 'От 1 года до 3 лет',
            'checked': true,
        },
        {
            'id': 'between3And6',
            'name': 'От 3 до 6 лет',
            'checked': false,
        },
        {
            'id': 'moreThan6',
            'name': 'Более 6 лет',
            'checked': false,
        }
    ],
    regions: [
        {
            'id': 'msk',
            'name': 'Москва',
            'location': 'area=1',
            'checked': false,
        },
        {
            'id': 'spb',
            'name': 'Санкт-Петербург',
            'location': 'area=2',
            'checked': false,
        },
        {
            'id': 'ekb',
            'name': 'Екатеринбург',
            'location': 'area=3',
            'checked': true,
        },
        {
            'id': 'remote',
            'name': 'Удалённая работа',
            'location': 'schedule=remote',
            'checked': true,
        }
    ]
}

module.exports = {

    searchParams: (() => {
        let result = {};
        const urlParams = (new URL(document.location)).searchParams;

        if(!urlParams.toString())
            return DEFAULT_SEARCH_PARAMS;

        for(let param in DEFAULT_SEARCH_PARAMS) {
            let dataFromUrl = urlParams.get(param);
            let tempData;
            const isKeyword = param === 'necessary' || param === 'unnecessary';
            const needDefaultValue = param === 'newInDays' || param === 'regions' || param === 'experience' /* || param === 'name'*/
            const emptyValue = (()=> {

                if(needDefaultValue)
                    return DEFAULT_SEARCH_PARAMS[param];

                if(isKeyword)
                    return [];

                return ''
            })();

            if(dataFromUrl && isKeyword) {
                tempData = dataFromUrl.split(',');
            } else if(dataFromUrl && (param === 'regions' || param === 'experience')) {
                tempData = [...DEFAULT_SEARCH_PARAMS[param]];
                dataFromUrl = dataFromUrl.split(',');

                tempData.forEach(item => item.checked = dataFromUrl.includes(item.id))
            } else {
                tempData = dataFromUrl;
            }

            result[param] = tempData ? tempData : emptyValue;
        }

        return result;
    })()
}