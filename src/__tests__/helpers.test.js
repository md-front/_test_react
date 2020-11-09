import { sortByReduction, sortByIncreasing, checkItems } from '../helpers';

let sortArr = [{a:1},{a:0},{a:2}];

describe('Сортировка', () => {

    it('по возрастанию +', () => {
        expect(sortByReduction(sortArr, 'a')).toEqual([{a:2},{a:1},{a:0}]);
    });

    it('по возрастанию -', () => {
        expect(sortByReduction(sortArr, 'a')).not.toEqual([{a:1},{a:1},{a:1}]);
    });

    it('по убыванию', () => {
        expect(sortByIncreasing(sortArr, 'a')).toEqual([{a:0},{a:1},{a:2}]);
    });
});

describe('Наличие элементов, при этом 1 из элементов содержит необходимое свойство', () => {

    it('empty array', () => {
        expect(checkItems([])).not.toBeTruthy();
    });
    it('empty param', () => {
        expect(checkItems([1])).not.toBeTruthy();
    });
    it('default', () => {
        expect(checkItems(sortArr, 'a')).toBeTruthy();
    });
    it('с неверным свойством', () => {
        expect(checkItems(sortArr, 'b')).toBeFalsy();
    });
    it('с параметром false', () => {
        expect(checkItems(sortArr, 'a', false)).toBeTruthy();
    });
});


