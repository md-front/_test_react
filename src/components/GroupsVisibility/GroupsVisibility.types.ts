import { GroupsEntries, IGroups } from '../Groups/Groups.types';
import { HiddenGroups } from '../../types/initialParams.types';

type SectionId = keyof HiddenGroups;
type GroupId = keyof IGroups;

export interface GroupsVisibilityProps {
    groupsEntries: Array<GroupsEntries>,
    sectionId: keyof HiddenGroups,
    toggleGroupVisibility: (sectionId: SectionId, groupId: GroupId) => void,
}
