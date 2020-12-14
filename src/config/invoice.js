import {logoBase64} from './logo'
export const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Simple invoice html template</title>
</head>
<body>

<style>
@import "https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,600i,700";html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,total,time,mark,audio,video{margin:0;padding:0;border:0;font-size:100%;font:inherit;vertical-align:baseline}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}body{line-height:1}ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:'';content:none}table{border-collapse:collapse;border-spacing:0}body{height:840px;width:592px;margin:auto;font-family:'Open Sans',sans-serif;font-size:15px}strong{font-weight:700}#container{position:relative;padding:4%}#header{height:80px}#header > #reference{float:right;text-align:right}#header > #reference h3{margin:0}#header > #reference h4{margin:0;font-size:85%;font-weight:600}#header > #reference p{margin:0;margin-top:2%;font-size:85%}#header > #logo{width:50%;float:left}#fromto{height:160px}#fromto > #from,#fromto > #to{width:45%;min-height:90px;margin-top:30px;font-size:85%;padding:1.5%;line-height:120%}#fromto > #from{float:left;width:45%;background:#efefef;margin-top:30px;font-size:85%;padding:1.5%}#fromto > #to{float:right;border:solid grey 1px}#items{margin-top:30px}#items > p{font-weight:700;text-align:right;margin-bottom:1%;font-size:65%}#items > table{width:100%;font-size:85%;border:solid grey 1px}#items > table th:first-child{text-align:left}#items > table th{font-weight:400;padding:1px 4px}#items > table td{padding:1px 4px}#items > table th:nth-child(2),#items > table th:nth-child(4){width:45px}#items > table th:nth-child(3){width:60px}#items > table th:nth-child(5){width:80px}#items > table tr td:not(:first-child){text-align:right;padding-right:1%}#items table td:nth-child(1){border-right:solid grey 1px}#items table tr td{padding-top:3px;padding-bottom:70px;height:10px}#items table tr:nth-child(1){border-bottom:solid grey 1px;padding-bottom: 10px}#items table tr th:nth-child(1){border-right:solid grey 1px;padding:3px}#items table tr:nth-child(2) > td{padding-top:8px}#summary{height:170px;margin-top:30px}#summary #note{float:left}#summary #note h4{font-size:10px;font-weight:600;font-style:italic;margin-bottom:4px}#summary #note p{font-size:10px;font-style:italic}#summary #total table{font-size:85%;width:260px;float:right}#summary #total table td{padding:3px 4px}#summary #total table tr td:last-child{text-align:right}#summary #total table tr:nth-child(3){background:#efefef;font-weight:600}#footer{margin:auto;position:absolute;left:4%;bottom:4%;right:4%;border-top:solid grey 1px}#footer p{margin-top:1%;font-size:65%;line-height:140%;text-align:center}
</style>

<style>
    #reference{
        float: left!important;
    text-align: left!important;
    }th{height: 21px}tbody{width:100%!important}
#container{height:100%;width:80%;margin:auto;    display: flex;
    flex-direction: column;
    justify-content: space-between;}
    #fromto {
    display: flex!important;
    height: 160px!important;
    justify-content: center;
    width: 100%!important;
}   #to, #from{ float:unset!important}
</style>

<div id="container">
<div id="header">
<div id="logo">
<img src="${logoBase64}"alt=""style="width: 280px">
</div>
<div id="reference">
            <p>
<strong>ACR LOGISTICS</strong><br>
460 ZION RD <br>
EGG HBR TWP, New Jersey, 08234 <br><br>
 <br>
Email: acrlogisticscarrier@gmail.com <br>
Phone: 609-318-4038
</p>

</div>
</div>

<div id="fromto" style="margin-top:60px">
<div id="from">
<h3><strong>Invoice for Load ID: {{id}}</strong></h3>
<p>Date: {{date}}</p>
<p>Notes: {{paymentNotes}}</p>
</div>
<div id="to">
<p>
<strong>{{broker.name}}</strong><br>
{{broker.address}}<br>
{{broker.city}}<br>
{{broker.state}}<br>
{{broker.zip}}
</p>
</div>
    </div>
    
<div id="fromto">
<div id="to" style="border-right: none;">
<h3><strong>Origin</strong></h3>
<h4>{{pickup.name}}</h4>
{{pickup.address}}<br>
{{pickup.city}}<br>
{{pickup.state}}<br>
{{pickup.zip}}
</div>
<div id="to">
<h3><strong>Destination</strong></h3>
<h4>{{delivery.name}}</h4>
{{delivery.address}}<br>
{{delivery.city}}<br>
{{delivery.state}}<br>
{{delivery.zip}}
</div>
</div>

<div id="items">
<table>
<tr>
<th>Description</th>

<th>Price</th>
</tr>
<tr>
<td style="height: 250px;">{{description}}</td>
<td><span>$</span>{{price}}</td>
</tr>

</tr>
</table>
</div>

<div id="summary">
<div id="note" style="width:50%; font-size: 14px">
<p>Factoring info: <br/>Aladdin Financial<br/>PO Box 1394<br/>Sioux Falls, SD 57101<br/>605-274-7088</p>
</div>
<div id="total">
<table border="1">

<tr>
<td>Total</td>
<td><span>$</span>{{price}}</td>

</tr>
</table>
<div id="note" style="float:right;margin-top:20px;font-size:12px">
Thank you for your business!
</div>
</div>
</div>


</div>

</body>
</html>
`

