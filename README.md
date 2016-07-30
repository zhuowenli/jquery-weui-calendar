# jquery-weui-calendar

## Usage

```html
<input id="calendar" class="weui_input" type="text">
```

```js
$('#calendar').MultiCalendar({
    title: '时间选择',
    totalMohth: 12,
    dayText: ['入住', '离开'],
    valueTypes: [
        {
            title: '上午',
            value: 'am'
        }, {
            title: '下午',
            value: 'pm'
        }
    ]
});
```

设置初始值：

```html
<input id="calendar"
    class="weui_input"
    type="text"
    value="2016-07-31 上午 至 2016-08-30 下午"
    data-start-time="2016-07-31"
    data-end-time="2016-08-30"
    data-start-value="am"
    data-end-value="pm">
```

