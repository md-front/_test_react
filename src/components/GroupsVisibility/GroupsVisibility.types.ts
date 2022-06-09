import { GroupsEntries, IGroups } from '../Groups/Groups.types';
import { SectionId } from '../../types/initialParams.types';

type GroupId = keyof IGroups;

export interface GroupsVisibilityProps {
    groupsEntries: Array<GroupsEntries>,
    sectionId: SectionId,
    toggleGroupVisibility: (sectionId: SectionId, groupId: GroupId) => void,
}
