import Banner from "../../components/Banner/Banner";
import Categories from "../../components/Categories/Categories";
import Footer from "../../components/Footer/Footer";
import TopDishes from "../../components/TopDishes/TopDishes";
import TopItems from "../../components/TopItems/TopItems";
import TopShops from "../../components/TopShops/TopShops";
import TopItemsForYou from "../../components/TopItemsForYou/TopItemsForYou";
import ChatBot from "react-simple-chatbot"
import Post from "../../components/Chat/Post";
import Function from "../../components/Chat/Function";
const HomePage = () => {
  const steps = [
    {
      id:'hello', 
      message:' Chào mừng bạn đã đến với What-eat-app', 
      trigger:'hello1',
    },
    {
      id:'hello1', 
      message:' Sẽ có 5 câu hỏi.Yêu cầu bạn trả lời thật chính xác.Những thông tin mà chúng tôi yêu cầu sau đây nhằm mục đích tư vấn tốt hơn cho bạn.', 
      trigger:'inputgender',
    },
    {
      id:'inputgender',
      message:'Giới tính của bạn là gì?', 
      trigger:'gender',
    },
    {
      id:'gender', 
      options: [
        { value:'Nam', label: 'Nam', trigger: 'inputpal' },
        { value:'Nữ', label: 'Nữ', trigger: 'inputpal' },
      ],
    },
    {
      id:'inputpal', 
      message:'Mức độ hoạt động của bạn? Vui lòng chọn.', 
      trigger:'pal',
    },
    {
      id: 'pal',
      options: [
        { value:'1.2', label: 'Không hoạt động vật lý', trigger: 'pal1' },
        { value:'1.375', label: 'Ít hoạt động vật lý', trigger: 'pal1' },
        { value:'1.55', label: 'Hoạt động vật lý vừa phải', trigger: 'pal1' },
        { value:'1.725', label: 'Hoạt động vật lý tích cực', trigger: 'pal1' },
      ],
    },
    {
      id:'pal1', 
      asMessage: true,
      message:'Tiếp theo. Vui lòng cho chúng tôi biết cân nặng của bạn?(Đơn vị kg)', 
      trigger:'weight',
    },
    {
      id:'weight', 
      user:true,
      validator: (value) => {
        if (isNaN(value)) {
          return 'Vui lòng nhập số. Xin cảm ơn!';
        } else if (value <= 0   ) {
          return 'Cân nặng không hợp lệ!';
        } else if (value > 500) {
          return 'Cân nặng không được lớn hơn 500kg';
        }
        return true;
      },
      trigger:'inputheight'
    },
    {
      id:'inputheight', 
      message:'Tiếp theo hãy cho chúng tôi biết chiều cao của bạn? (Đơn vị cm)', 
      trigger:'height',
    },
    {
      id:'height', 
      user:true,
      validator: (value) => {
        if (isNaN(value)) {
          return 'Vui lòng nhập số. Xin cảm ơn!';
        } else if (value <= 0   ) {
          return 'Chiều cao không hợp lệ!';
        } else if (value >= 210) {
          return 'Chiều cao không được lớn hơn 210cm';
        }
        return true;
      },
      trigger:'inputyear',
    },
    
    {
      id:'inputyear', 
      message:'Hãy điền năm sinh của bạn?', 
      trigger:'year',
    },
    {
      id:'year', 
      user:true,
      validator: (value) => {
        if (isNaN(value)) {
          return 'Vui lòng nhập số. Xin cảm ơn!';
        } else if (value <= 1990   ) {
          return 'Năm Sinh không hợp lệ!';
        } else if (value >= 2023) {
          return 'Năm Sinh không hợp lệ!';
        }
        return true;
      },
      trigger:'inputallergy'
    },
    {
      id:'inputallergy', 
      message:'Hãy chọn thức ăn, gia vị mà bạn bị dị ứng!', 
      trigger:'allergy',
    },
    {
      id:'allergy', 
      user:true,
      trigger:'q-person'
    },
    {
      id:'q-person', 
      message:'Hãy nhập số người sử dụng thực đơn', 
      trigger:'person',
    },
    {
      id:'person',
      user:true,
      validator: (value) => {
        if (isNaN(value)) {
          return 'Vui lòng nhập số. Xin cảm ơn!';
        } else if (value <= 0   ) {
          return 'Số lượng người ăn không hợp lệ!';
        }
        return true;
      },
      trigger:'7'
    },
    {
      id:'7',
      message:'Cảm ơn bạn. Đây là những thông tin cá nhân của bạn.',
      trigger:'review'
    },
    {
            id: 'review',
            component: <Post />,
            asMessage: true,
            trigger:'update',
          },
    {
      id: 'update',
      message: 'Bạn có muốn thay đổi thông tin đã nhập',
      trigger: 'update-question',
      },
    {
      id: 'update-question',
      options: [
        { value: 'y', label: 'Có', trigger: 'yes' },
        { value: 'n', label: 'Không', trigger: 'no' },
            ],
          },
    {
      id: 'yes',
      message: 'Hãy chọn vị trí mà bạn muốn thay đổi',
      trigger: 'update-fields',
    },
    {
            id: 'update-fields',
            options: [
              { value: 'gender', label: 'Giới Tính', trigger: 'update-gender' },
              { value: 'year', label: 'Năm Sinh', trigger: 'q-year' },
              { value: 'weight', label: 'Cân Nặng', trigger: 'q-weight' },
              { value: 'height', label: 'Chiều Cao', trigger: 'q-height' },
              { value: 'allergy', label: 'Dị Ứng', trigger: 'q-allergy' },
              { value: 'person', label: 'Số lượng người', trigger: 'q-person' },
              { value: 'pal', label: 'Mức độ hoạt động', trigger: 'update-pal' },
            ],  
    },
    {
      id: 'update-gender',
      update: 'gender',
      trigger: '7',
    },
    {
      id: 'q-year',
      message:'nhập năm sinh của bạn.',
      trigger: 'update-year',
    },
    {
      id: 'update-year',
      update: 'year',
      trigger: '7',
    },
    {
      id: 'q-weight',
      message:'nhập cân nặng của bạn.',
      trigger: 'update-weight',
    },
    {
      id: 'update-weight',
      update: 'weight',
      trigger: '7',
    },
    {
      id: 'q-height',
      message:'nhập chiều cao của bạn.',
      trigger: 'update-height',
    },
    {
      id: 'update-height',
      update: 'height',
      trigger: '7',
    },
    {
      id: 'q-allergy',
      message:'nhập món ăn dị ứng của bạn.',
      trigger: 'update-allergy',
    },
    {
      id: 'update-allergy',
      update: 'allergy',
      trigger: '7',
    },
    {
      id: 'q-person',
      message:'nhập số người của bạn.',
      trigger:'update-person'
    },
    {
      id: 'update-person',
      update: 'person',
      trigger: '7',
    },
    {
      id: 'update-pal',
      update: 'pal',
      trigger: '7',
    },
    {
      id:'no', 
      message:'Tất cả đã xong bạn có muốn hoàn tất!', 
      trigger:'submit'
    },
    {
      id:'submit', 
      options:[
      {value:'y', label:'Có', trigger:'end-message'},
      {value:'n', label:'Không', trigger:'no-submit'},
      ] 
    },
    {
            id: 'no-submit',
            message:'Thông tin của bạn chưa được lưu', 
            trigger:'7',
         },
              {
            id: 'end-message',
            component: <Function />,
            asMessage: true,
            end: true,
         },
  ];
  
  return (
    <main>
      <ChatBot steps={steps} floating />
      <Banner />
      <Categories />
      <TopItems />
      <TopItemsForYou />
      <TopDishes />
      <TopShops />
      <Footer />
    </main>
  );
};

export default HomePage;
