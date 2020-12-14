import excel from 'exceljs'

const generateExcel = (reportOrders)=>{
    const wb = new excel.Workbook()
    const ws = wb.addWorksheet('Orders')
    ws.columns = [
        {header:'Load ID', key:'id',width:10},
        {header:'Date', key:'date',width:10},
        {header:'Broker', key:'brname',width:10},
        {header:'Driver', key:'drname',width:10},
        {header:'Load Info', key: 'description',width:15},
        {header:'Pickup Address',key:'paddress',width:15},
        {header:'Pickup City', key:'pcity',width:10},
        {header:'Pickup State', key:'pstate',width:10},
        {header:'Pickup Zip', key:'pzip'},
        {header:'Delivery Address', key:'daddress',width:15},
        {header:'Delivery City', key:'dcity',width:10},
        {header:'Delivery State', key:'dstate',width:10},
        {header:'Delivery ZIP', key:'dzip',width:10},
        {header:'Payment Notes', key:'paymentNotes',width:15},
        {header:'Payment Method', key:'paymentMethod',width:10},
        {header:'Price', key:'price',width:10},
        {header:'Dispatcher', key:'diname',width:10},
        {header:'Invoiced', key:'invoiced',width:10},
        {header:'Status', key:'status'}
    ]
    var total = 0
    var orders = reportOrders.map(order=>{
        const {pickup, delivery, driver, dispatcher, broker, date, price}=order
        total = total+parseFloat(price)
        const p = pickup
        const d = delivery
        return {...order, brname:broker.name,date:new Date(date.seconds*1000).toLocaleDateString(),price:`$${price}`, drname:driver.name, paddress:p.address, pcity:p.city, pstate:p.state, pzip:p.zip, daddress:d.address,dcity:d.city,dstate:d.state,dzip:d.zip,diname:dispatcher?.name }
    })
    ws.addRows(orders)
    ws.addRow({price:`$${total}`})
    return wb
}

export default async (req,res) => {
    const {reportOrders} = req.body
    const excel = generateExcel(reportOrders)
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "report.xlsx"
        );
        excel.xlsx.write(res).then(()=> res.status(200).end())

}
