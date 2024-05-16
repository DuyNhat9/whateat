import React, { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ShopChart.css';
import axios from 'axios';
import { Tabs } from 'antd';
import { AiOutlineBarChart } from 'react-icons/ai';
import { TbReportAnalytics, TbReportMoney } from 'react-icons/tb';

function ShopChart() {
	const inputRef = useRef(null);
	const dateFromRef = useRef(null);
	const dateToRef = useRef(null);
	const [data, setData] = useState([])
	const [totalSell, setTotalSell] = useState(0)
	const [today, setToday] = useState([])
	const [yesterday, setYesterday] = useState([])

	// fetch api with axios with body
	// can tao ra 1 endpoint ma nhan 3 parameter
	const fetchData = async () => {
		const date_from = dateFromRef == null ? "" : dateFromRef.current.value
		const date_to = dateToRef == null ? "" : dateToRef.current.value
		// http://localhost:5000/get_min_max_date/1?start_from=2022-05-05&start_to=2022-05-05
		const data = axios.get( `${process.env.REACT_APP_PYTHON_API_KEY}/get_min_max_date/1?start_from=${date_from}&start_to=${date_to}`);
		const result = await data
		setData(result.data)
	};

	const fetchToday = async () => {
		let ts = Date.now();
		let date_ob = new Date(ts);
		let date = date_ob.getDate();
		let month = date_ob.getMonth() + 1;
		let year = date_ob.getFullYear();
		const date_str = year + "-" + month + "-" + date
		// http://localhost:5000/get_min_max_date/1?start_from=2022-05-05&start_to=2022-05-05
		const data = axios.get( `${process.env.REACT_APP_PYTHON_API_KEY}/get_sale_by_date/1?date=${date_str}`);
		const result = await data
		const tempRes = result.data
		const res =[]
		res.push(tempRes['date'])
		res.push(tempRes['total_sales'])
		res.push(tempRes['total_transaction'])
		setToday(res)
	};
	const fetchYesterday = async () => {
		let yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
		let date = yesterday.getDate();
		let month = yesterday.getMonth() + 1;
		let year = yesterday.getFullYear();
		const date_str = year + "-" + month + "-" + date
		// const date_str = year + "-" + month + "-" + date
		// http://localhost:5000/get_min_max_date/1?start_from=2022-05-05&start_to=2022-05-05
		const data = axios.get( `${process.env.REACT_APP_PYTHON_API_KEY}/get_sale_by_date/1?date=${date_str}`);
		const result = await data
		const tempRes = result.data
		const res =[]
		res.push(tempRes['date'])
		res.push(tempRes['total_sales'])
		res.push(tempRes['total_transaction'])
		setYesterday(res)
	};

	useEffect(() => {
		fetchToday()
		fetchYesterday()
		fetchData()
		// inputRef.current.value, dateFromRef.current.value, dateToRef.current.value
	}, [data.length]);
	const handleClick = () => {
		fetchData()
	}

	return (
		<div className='mt-10 bg-white flex'>
			<div className='bg-base-100 w-screen'>
				<Tabs
					tabPosition={'left'}
					items={[
						{
							label: (
								<span className='flex flex-row gap-1 items-center'>
									<AiOutlineBarChart className='' />
									Tổng quan
								</span>
							),
							key: 1,
							children: (
								<div className='flex flex-row overflow-hidden'>
									<div className='flex flex-col'>
										<span className='mb-5 font-bold text-lg'>Tổng quan</span>
										<div className=' h-1/4 p-5 flex flex-row items-center justify-between'>
											<div className='flex flex-col'>
												<label
													htmlFor='Chọn cửa hàng'
													className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
												>
													Cửa hàng
												</label>
												<input
													ref={inputRef}
													type='text'
													placeholder='Chọn cửa hàng'
													className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
												/>
											</div>
											<div className='flex flex-col mx-5'>
												<label
													htmlFor='Chọn cửa hàng'
													className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
												>
													Thời gian
												</label>
												<div className='flex flex-row items-center'>
													<input
														ref={dateFromRef}
														type='date'
														className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
													/>
													<span>-</span>
													<input
														ref={dateToRef}
														type='date'
														className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
													/>
												</div>
											</div>
											<div>
												<button className='text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium  text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900' onClick={handleClick}>
													Chọn
												</button>
												<button className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium  text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'>
													Cài đặt lại
												</button>
											</div>
										</div>
										<div className=' my-5'>
											<div className='flex flex-row'>
												<div className='w-2/3 flex flex-col border-r-2	 border-gray-200'>
													<div className='flex flex-col p-5'>
														<span className='text-base text-red-500 font-bold'>{totalSell}</span>
														<span className='text-sm'>Tổng doanh số(đ)</span>
													</div>
													<hr className='border-gray-200 border-t-2' />
													<div className='flex flex-row'>
														<div className='w-1/2 flex flex-col border-gray-200 border-r-2 p-5'>
															<span className='text-base font-bold'>0</span>
															<span className='text-sm'>Đã thanh toán (đ)</span>
														</div>

														<div className='w-1/2 flex flex-col p-5'>
															<span className='text-base font-bold'>0</span>
															<span className='text-sm'>Chờ xử lý (đ)</span>
														</div>
													</div>
												</div>

												<div className='flex flex-col w-1/3 justify-center pl-5'>
													<span className='text-base font-bold text-red-500'>0</span>
													<span className='text-sm'>Tổng giao dịch</span>
												</div>
											</div>
										</div>
										<div className='flex flex-row'>
											<LineChart
												width={1000}
												height={500}
												data={data}
												margin={{
													top: 15,
													right: 0,
													left: 0,
													bottom: 15,
												}}
											>
												<CartesianGrid strokeDasharray='3 3' />
												<XAxis dataKey='date' />
												<YAxis />
												<Tooltip />
												{/* <Legend /> */}
												<Line type='monotone' dataKey='value' stroke='#8884d8' activeDot={{ r: 8 }} />
											</LineChart>
										</div>
									</div>
									<div className='flex-1 px-5'>
										<div className='w-full h-auto p-5'>
											<div className='flex flex-col'>
												<span>Hôm nay</span>
												<span className='text-red-500'>{today[0]}</span>
											</div>
											<div className='flex flex-col'>
												<span>Tổng doanh số (đ)</span>
												<span className='text-red-500'>{today[1]}</span>
											</div>
											<div className='flex flex-col'>
												<span>Tổng giao dịch</span>
												<span className='text-red-500'>{today[2]}</span>
											</div>
											<hr className='my-2' />
											<div className='flex flex-col'>
												<span>Hôm qua</span>
												<span className='text-red-500'>{yesterday[0]}</span>
											</div>
											<div className='flex flex-col'>
												<span>Tổng doanh số (đ)</span>
												<span className='text-red-500'>{yesterday[1]}</span>
											</div>
											<div className='flex flex-col'>
												<span>Tổng giao dịch</span>
												<span className='text-red-500'>{yesterday[2]}</span>
											</div>
										</div>
									</div>
								</div>
							),
						},
						{
							label: (
								<span className='flex flex-row gap-1 items-center'>
									<TbReportAnalytics className='' />
									Báo cáo giao dịch
								</span>
							),
							key: 2,
							children: `Báo cáo giao dịch`,
						},
						{
							label: (
								<span className='flex flex-row gap-1 items-center'>
									<TbReportMoney className='' />
									Báo cáo thanh toán
								</span>
							),
							key: 3,
							children: `Báo cáo thanh Toán`,
						},
					]}
				/>
			</div>
		</div>
	);
}

export default ShopChart;