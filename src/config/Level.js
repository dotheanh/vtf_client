const ITEMS_DATA = [
    {   // vàng 1
        itemType: 1,
        itemValue: 10,
        itemSpeed: 120,
    },
    {   // vàng 2
        itemType: 2,
        itemValue: 20,
        itemSpeed: 110,
    },
    {   // vàng 3
        itemType: 3,
        itemValue: 30,
        itemSpeed: 100,
    },
    {   // vàng 5
        itemType: 4,
        itemValue: 50,
        itemSpeed: 80,
    },
    {   // vàng 10
        itemType: 5,
        itemValue: 100,
        itemSpeed: 60,
    },
    {   // đá 1
        itemType: 6,
        itemValue: 5,
        itemSpeed: 100,
    },
    {   // đá 4
        itemType: 7,
        itemValue: 10,
        itemSpeed: 80,
    },
    {   // đá 7
        itemType: 8,
        itemValue: 15,
        itemSpeed: 60,
    },
    {   // đá 10
        itemType: 9,
        itemValue: 20,
        itemSpeed: 50,
    },
    {   // mystery bag
        itemType: 10,
        itemValue: -1,  // return random
        itemSpeed: 80,
    },
    {   // bonus bomb
        itemType: 11,
        itemValue: 0,
        itemSpeed: 100,
    },
    {   // jewel 1
        itemType: 12,
        itemValue: 100,
        itemSpeed: 150,
    },
    {   // jewel 2
        itemType: 13,
        itemValue: 110,
        itemSpeed: 150,
    },
    {   // jewel 3
        itemType: 14,
        itemValue: 120,
        itemSpeed: 150,
    },
    {   // barrel
        itemType: 15,
        itemValue: 10,
        itemSpeed: 120,
    },
    {   // treasure
        itemType: 16,
        itemValue: 180,
        itemSpeed: 60,
    },
    {   // skull
        itemType: 17,
        itemValue: 20,
        itemSpeed: 120,
    },
    {   // mole
        itemType: 18,
        itemValue: 10,
        itemSpeed: 150,
    },
];

const TEST_MODE = false;

const LEVELS = [
    {   // LEVEL 1
        TARGET : TEST_MODE ? 0 : 800, // TARGET = 800 điểm tối thiểu để vượt qua level
        DURATION : TEST_MODE ? 3 : 60,  // DURATION = 60 thời gian countdown level 
        MAX_ITEMS_COUNT : 80, // MAX_ITEMS_COUNT = 80 số lượng item tối đa trong màn chơi
        MIN_MOLES : 2,    // MIN_MOLES = 2 số lượng chuột tối thiểu trong màn chơi
        MAX_MOLES : 7,    // MAX_MOLES = 7 số lượng chuột tối đa trong màn chơi
        CABLE_SEGMENT_LENGTH : 2, // CABLE_SEGMENT_LENGTH = 2 độ dài mỗi đơn vị dây cáp
        ITEMS_LIST : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], // list những item có thể xuất hiện trong level này
    },
    {   // LEVEL 2
        TARGET : TEST_MODE ? 0 : 160,
        DURATION : TEST_MODE ? 3 : 40,
        MAX_ITEMS_COUNT : 0,
        MIN_MOLES : 60,
        MAX_MOLES : 80,
        CABLE_SEGMENT_LENGTH : 2,
        ITEMS_LIST : [],
    },
    {   // LEVEL 3
        TARGET : TEST_MODE ? 0 : 200,
        DURATION : TEST_MODE ? 3 : 60,
        MAX_ITEMS_COUNT : 60,
        MIN_MOLES : 0,
        MAX_MOLES : 0,
        CABLE_SEGMENT_LENGTH : 2,
        ITEMS_LIST : [11, 12, 13, 15],
    },
    {   // LEVEL 4
        TARGET : TEST_MODE ? 0 : 1000,
        DURATION : TEST_MODE ? 3 : 60,
        MAX_ITEMS_COUNT : 70,
        MIN_MOLES : 3,
        MAX_MOLES : 7,
        CABLE_SEGMENT_LENGTH : 2,
        ITEMS_LIST : [1,2,3,4,5,10,11,12,17],
    },
    {   // LEVEL 5
        TARGET : TEST_MODE ? 0 : 1200,
        DURATION : TEST_MODE ? 3 : 60,
        MAX_ITEMS_COUNT : 70,
        MIN_MOLES : 5,
        MAX_MOLES : 10,
        CABLE_SEGMENT_LENGTH : 2,
        ITEMS_LIST : [4,5,6,7,8,9,10,11,12,13],
    },
    {   // LEVEL 6
        TARGET : TEST_MODE ? 0 : 500,
        DURATION : TEST_MODE ? 3 : 90,
        MAX_ITEMS_COUNT : 70,
        MIN_MOLES : 3,
        MAX_MOLES : 7,
        CABLE_SEGMENT_LENGTH : 2,
        ITEMS_LIST : [6,7,8,9],
    },
    {   // LEVEL 7
        TARGET : TEST_MODE ? 0 : 2000,
        DURATION : TEST_MODE ? 3 : 60,
        MAX_ITEMS_COUNT : 70,
        MIN_MOLES : 5,
        MAX_MOLES : 10,
        CABLE_SEGMENT_LENGTH : 2,
        ITEMS_LIST : [10],
    }
]