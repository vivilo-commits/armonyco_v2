
export interface Unit {
    id: string;
    name: string;
    groupId: string;
    groupName: string;
    activeProducts: string[]; // Array of product IDs enabled for this unit
}

export interface UnitGroup {
    id: string;
    name: string;
    unitsCount: number;
}

export const unitGroups: UnitGroup[] = [
    { id: 'group-01', name: 'Milan Downtown', unitsCount: 12 },
    { id: 'group-02', name: 'Rome Historic Center', unitsCount: 8 },
    { id: 'group-03', name: 'Barcelona Beachfront', unitsCount: 15 },
    { id: 'group-04', name: 'Florence Outskirts', unitsCount: 5 },
];

export const units: Unit[] = [
    // Group 1
    { id: 'u-01', name: 'Duomo Suite 101', groupId: 'group-01', groupName: 'Milan Downtown', activeProducts: ['cc-01', 'cc-02', 'cc-03', 'cc-05', 'cc-06', 'cc-08', 'cc-10', 'cc-11', 'cc-12', 'pb-01', 'pb-03', 'pb-05', 'pb-06', 'pb-07', 'pb-08', 'pb-09', 'pb-10'] },
    { id: 'u-02', name: 'Brera Loft A', groupId: 'group-01', groupName: 'Milan Downtown', activeProducts: ['cc-01', 'cc-02', 'cc-03', 'cc-05', 'cc-06'] },
    { id: 'u-03', name: 'Navigli Studio', groupId: 'group-01', groupName: 'Milan Downtown', activeProducts: ['cc-01', 'cc-02', 'cc-03'] },

    // Group 2
    { id: 'u-04', name: 'Trastevere Charming 1', groupId: 'group-02', groupName: 'Rome Historic Center', activeProducts: ['cc-01', 'cc-02', 'cc-03', 'cc-05', 'cc-06', 'cc-08'] },
    { id: 'u-05', name: 'Pantheon Luxury', groupId: 'group-02', groupName: 'Rome Historic Center', activeProducts: ['cc-01', 'cc-02', 'cc-03', 'cc-05', 'cc-06', 'cc-08'] },

    // Group 3
    { id: 'u-06', name: 'Eixample Terrace', groupId: 'group-03', groupName: 'Barcelona Beachfront', activeProducts: ['cc-01', 'cc-02', 'cc-03', 'cc-05', 'cc-06'] },
    { id: 'u-07', name: 'Barceloneta Sea View', groupId: 'group-03', groupName: 'Barcelona Beachfront', activeProducts: ['cc-01', 'cc-02', 'cc-03', 'cc-05', 'cc-06'] },
];
