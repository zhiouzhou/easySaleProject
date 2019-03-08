const state={
  memberInfoList:[{
    id:'0',
    name:"张清",
    phone:"18988293847",
    shop:"山脚小铺",
    address:"西藏自治区拉萨市城关区扎西街道仅配送",
    agent:{},
    productList:[{
      id:'021',
      imgUrl:`../../../../static/icons/kc_ic_rk@2x.png`,
      note:'国窖1573酒52度红宝石版新春特惠版新春特惠版新春特惠新春特惠',
      price:'268',
      qty:'件',
      size:'6瓶/件',
      day:'1'

    },
      {
        id:'022',
        imgUrl:`../../../../static/icons/kc_ic_rk@2x.png`,
        note:'国窖1573酒52度红宝石版新春特惠版新春特惠版新春特惠新春特惠',
        price:'2168',
        qty:'件',
        size:'20瓶/件',
        day:'1'

      }
    ]
  },
    {
      id:'1',
      name:"王明",
      phone:"18988293857",
      shop:"块小小店",
      address:"西藏自治区拉萨市城关区扎西街道仅配送",
      agent:{},
      // agent:[{
      //   id:'011',
      //   name:'李华',
      //   telephone:"18756987854",
      //   customerNum:"10"
      // },{
      //   id:'012',
      //   name:'张华华',
      //   telephone:"14756987854",
      //   customerNum:"10"
      // }],
      productList:[{
        id:'121',
        imgUrl:`../../../../static/icons/kc_ic_rk@2x.png`,
        note:'国窖1573酒52度红宝石版新春特惠版新春特惠版新春特惠新春特惠',
        price:'168',
        qty:'件',
        size:'8瓶/件',
        day:'9'

      }
      ]
    }],

}

const getters = {
  getMemberList:state =>{
    return  state.memberInfoList
  },
  getProductList: (state) => (id) => {
    return state.memberInfoList.find(item => item.id === id)
  }

}

const mutations = {

  changeAgent(state, {selectAgent,memberListId}) {
    state.memberInfoList[memberListId].agent= selectAgent
  },


};

const actions = {

};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
