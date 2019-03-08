const custom_dict = {
  custom: {
    username: {
      required: '请输入用户名/手机号',
      alpha_num: '只能输入数字字母'
    },
    passwordLogin: {
      required: '请输入密码',
      alpha_dash: '只能输入字母、数字、下划线、破折号'
    },
    address: {
      required: '请输入地址'
    },
    storename: {
      required: '请输入仓库名称'
    },
    detailAddress: {
      required: '请输入详细地址'
    },
    activityDate: {
      required: '清输入活动日期'
    },
    limitDate: {
      required: '请输入优惠券有效日期'
    },
    productName: {
      required: '请输入产品名称'
    },
    couponTotalNum: {
      required: '请输入发放数量',
      numeric: '发放数量必须是整数',
      min_value: '发放数量必须大于0',
    },
    discountAmount: {
      required: '请输入抵扣金额',
      decimal: '抵扣金额必须是数字',
      min_value: '抵扣金额必须大于0',
    },
    price: {
      required: '请输入商品价格',
      decimal: '商品价格必须是数字',
      min_value: '商品价格必须大于0',
    },
    days: {
      required: '请输入有效日期',
      numeric: '有效日期必须是整数',
      min_value: '有效日期必须大于0',
    },
    requireOrderAmount: {
      required: '请输入最低下单金额',
      decimal: '最低下单金额必须是数字',
      //min_value:'最低下单金额必须大于抵扣金额',
    },
    staffName: {
      required: '请输入员工姓名'
    },
    staffPhone: {
      required: '请输入联系方式'
    },
    staffRole: {
      required: '请选择角色'
    },
    staffPsd: {
      required: '请输入账户密码'
    },
    confirmCode: {
      required: '请输入验证码',
      digits: '验证码必须是数字，并且精确到6位',
    },
    password: {
      required: '请输入密码',
      alpha_dash: '只能输入字母、数字、下划线、破折号',
      min: '密码至少有6字符',
      max: '密码最多有18字符',
    },
    confirmPassword: {
      required: '请确认密码',
      confirmed: '两次密码输入不一致'
    },
    minSellingPrice: {
      required: '请输入批发价',
      decimal: '批发价必须是数字',
      min_value: '最小批发价必须大于0',
    },
    maxSellingPrice: {
      required: '请输入批发价',
      decimal: '批发价必须是正数',
      min_value: '最大批发价必须大于最小批发价',
    },
    sellingPrice: {
      required: '请输入批发价',
      decimal: '批发价必须是正数',
      min_value: '批发价必须大于0',
    },
    guidePrice: {
      required: '请输入零售指导价',
      decimal: '零售指导价必须是正数',
      min_value: '零售指导价必须大于0',
    },
    SellingPrice: {
      required: '请输入批发价'
    },
    minPurchaseNum: {
      required: '请输入起购规则',
      min_value: '起购规则必须大于0',
      integerNo: `请输入整数`
    },
    requiredNumber: {
      required: '请输入购买数量',
      decimal: '数量必须是正数',
      min_value: '购买数量必须大于0',
    },
    giftName: {
      required: '请选择赠品名称',
    },
    giftNum: {
      required: '请输入赠送数量',
      decimal: '赠送数量必须是正数',
      min_value: '赠送数量必须大于0'
    },
    maxGiftNum: {
      required: '请输入最大赠送数量',
      decimal: '最大赠送数量必须是正数',
      min_value: '最大赠送数量必须大于0'
    },
    giftTime: {
      required: '请设置活动时间'
    },
    quantity: {
      required: '请输入销售规格数量',
      decimal: '销售规格数量必须是正数',
      min_value: '销售规格数量必须大于0'

    },
    bottleCode: {
      number: '条形码只能是整型数字'
    },
    code: {
      number: '箱码只能是整型数字'
    },

  },
  zh_CN: {
    messages: {
      is: () => '两次输入不一致'
    }
  }
};

export default custom_dict;
