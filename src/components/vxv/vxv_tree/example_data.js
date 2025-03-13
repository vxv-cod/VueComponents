  export const nodes = [
    {
      id: 1,
      label: 'Объект_1',
      children: [
        { label: 'ПД' },
        { label: 'РД' }
      ]
    },{ 
      id: 2,
      label: 'Объект_2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      children: [
        { 
          label: 'ПД',
          children: [
            {
              label: 'Отдел АСО',
              children: [
                { label: 'ххх.ххх.ххх-001.АСО' },
                { label: 'ххх.ххх.ххх-002.АСО' },
                { label: 'ххх.ххх.ххх-003.АСО' },
              ]
            },{
              label: 'Отдел ТХ',
              children: [
                { label: 'ххх.ххх.ххх-001.ТХ' },
                { 
                  id: '2.2',
                  label: 'ххх.ххх.ххх-002.ТХ',
                  children: [
                    { label: 'Hревизия_1' },
                    { label: '000_ревизия_2' }
                  ]
                 },
              ]
            }
          ]
          },{ 
          label: 'РД',
          children: [
            {
              label: 'Комплект 002.001 ',
              children: [
                { label: 'ревизия_1' },
                { label: 'ревизия_2' }
              ]
            }
          ]
          },{ 
          label: 'Комплект 002 Lorem ipsum dolor sit',
          children: [
            { label: 'ревизия_1' },
            { label: 'ревизия_2' }
          ]
        }
      ]
    },{
      id: 3,
      label: 'Объект_3',
      children: [
        { label: 'ПД', children: [] },
        { label: 'РД' }
      ]
    },{
      id: 3,
      label: 'Объект_311',
      children: [
        { label: 'ПД', children: [] },
        { label: 'РД' }
      ]
    },{
      id: 3,
      label: 'Объект_312',
      children: [
        { 
          label: 'ПД', 
          children: [
            { label: 'ревизия_3' },
            { label: 'ревизия_4' }
          ]
        },
        { label: 'РД' }
      ]
    }
  ]