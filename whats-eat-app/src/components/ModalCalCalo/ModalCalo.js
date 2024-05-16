import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Input, Form,InputNumber ,DatePicker, Select, Steps, Button, message } from 'antd';
import moment from 'moment'
import './ModalCalo.css'
import TopDishesForYou from '../TopDishOnKcalModal/TopDishesForYou'
import locale from 'antd/es/date-picker/locale/vi_VN';
const { Option } = Select;
const { Step } = Steps;

const steps = [
    {
        title: 'Nhập thông tin',
    },
    {
        title: 'Lựa món yêu thích',
    }
];

const dateFormat = 'YYYY-MM-DD';

const ModalCalo = ({ isModalVisible, handleOk, handleCancel }) => {
    const [form] = Form.useForm();
    const [gender, setGender] = useState('male')
    const [pal, setPal] = useState('1.55')
    const [weight,setWeight] = useState(58)
    const [height,setHeight] = useState(168)
    const [year, setYear] = useState(moment('1999', dateFormat))
    const [allergy, setAllergy] = useState('')
    const [person, setPerson] = useState('')
    const [current, setCurrent] = React.useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    }; 

    const onFinish = () => {
        handleOk(gender,pal,weight,height,year,allergy,person)
    }

    const onGenderChange = (e) => {
        setGender(e)
    }

    const onPALChange = (e) => {
        setPal(e)
    }

    const onAllgeryChange = (e) => {
        setAllergy(e)
    }
    function onBirthChange(date, dateString) {
        setYear(dateString)
        console.log(date, dateString);
    }

    const onClick = () => {
        handleOk(year, gender, pal)
    }

    return (
        <>
            <Modal width={1000} footer={null} title="Bảng tính calo hằng ngày" visible={isModalVisible}>
                <Steps current={current}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className="steps-content">{
                    current === 0 ? <Form form={form} labelCol={{
                        span: 10,
                    }}
                        wrapperCol={{
                            span: 8,
                        }}
                        layout="horizontal"
                        size="default">
                        <Form.Item
                            name="year"
                            label="Năm sinh">
                                <DatePicker onChange={onBirthChange} picker="year" defaultValue={year} style={{width: "100%",textAlign:"center"}} />
                            {/* <DatePicker defaultValue={year} locale={locale} style={{width: "100%"}} onChange={onBirthChange} /> */}
                        </Form.Item>
                        <Form.Item
                            name="gender"
                            label="Giới tính">
                            <Select defaultValue={gender} style={{alignItems:'flex-start',display: "flex"}}
                            onChange={onGenderChange}
                            >
                                <Option value="male">Nam</Option>
                                <Option value="female">Nữ</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="weight"
                            label="Cân nặng (kg)">
                            <InputNumber defaultValue={weight} onChange={e => setWeight(e.target.value)} style={{width: "100%",textAlign:"center"}}></InputNumber>
                        </Form.Item>
                        <Form.Item
                            name="height"
                            label="Chiều cao (cm)">
                            <InputNumber defaultValue={height} onChange={e => setHeight(e.target.value)} style={{width: "100%",textAlign:"center"}}></InputNumber>
                        </Form.Item>
                        <Form.Item
                            name="PAL"
                            label="Mức độ hoạt động ">
                            <Select
                            defaultValue={pal}
                            onChange={onPALChange}
                            >
                                <Option value="1.2">Không hoạt động thể chất</Option>
                                <Option value="1.375">Mức độ ít</Option>
                                <Option value="1.55">Mức độ trung bình</Option>
                                <Option value="1.725">Mức độ nhiều</Option>
                                <Option value="1.9">Mức độ rất nhiều</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="allergy"
                            label="Dị ứng với:">
                            {/* <Select
                            onChange={onAllgeryChange}
                            >
                                <Option value="Cá">Cá</Option>
                                <Option value="Tôm">Tôm</Option>
                                <Option value="Cua">Cua</Option>
                                <Option value="Sữa">Sữa</Option>
                                <Option value="Trứng">Trứng</Option>
                                <Option value="Hạt">Hạt</Option>
                                <Option value="Đậu phộng">Đậu phộng</Option>
                                <Option value="Đậu nành">Đậu nành</Option>
                            </Select> */}
                            <Input placeholder="Cá, Cua, Gà, Đậu Phộng,..." onChange={e => setAllergy(e.target.value)} ></Input>
                            
                        </Form.Item>
                        <Form.Item
                            name="person"
                            label="Số lượng người ăn">
                            <InputNumber  onChange={e => setPerson(e.target.value)} style={{width: "100%",textAlign:"center"}}></InputNumber>
                        </Form.Item>
                    </Form> : <TopDishesForYou />
                }</div>
                <div className="steps-action">
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={onFinish}>
                            Done
                        </Button>
                    )}
                    {current > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                            Previous
                        </Button>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default ModalCalo;