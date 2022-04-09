import { IGroup } from '../Group/Group.types';

export interface IGroups {
    isFav: IGroup,
    isNew: IGroup,
    exp6: IGroup,
    exp3: IGroup,
    isJun: IGroup,
    isSalary: IGroup,
    default: IGroup,
}

export type GroupsEntries = [keyof IGroups, IGroup]

export interface GroupsProps {
    groupsEntries: Array<GroupsEntries>
}
