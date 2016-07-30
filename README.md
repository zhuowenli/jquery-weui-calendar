# jquery-weui-calendar

基于jquery-weui的日历插件扩展。

该项目依赖于[weui](https://github.com/weui/weui)、[jquery-weui](https://github.com/lihongxun945/jquery-weui)。

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

\            |  Default          | Description
:------------|:------------------|:-----------
`title`      | 时间选择           | String, 日历弹窗标题
`totalMohth` | 6                 | Number, 可选月份长度
`dayText`    | `['开始', '结束']` | Array, 选中标识
`valueTypes` | `null`            | 辅助时间选择器，比如：上午、下午，1点、2点、3点等。

### 设置初始值：

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

\                  |  Default | Description
:------------------|:---------|:------------
`data-start-time`  | `null`   | 开始时间
`data-end-time`    | `null`   | 结束时间
`data-start-value` | `null`   | 开始value值
`data-end-value`   | `null`   | 结束value值

