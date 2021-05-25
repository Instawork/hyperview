<text id="ID_VerifyCode" hide="true">
// <![CDATA[
{
  "verify" : [
    {
      fields: ["GoalName"],
      rule: function(v) {
        if(v) {
          return true;
        }
        return false;
      },
    },
    {
      fields: ["UserAge"],
      rule: function(v) {
        v = parseInt(v);
        if(v >= 50) {
          return true;
        }
        return false;
      },
    },
    {
      fields: ["Amount1Name", "Amount2Name", "Amount3Name"],
      rule: function(v) {
        const re = /^\d{1,3}$/;
        if(re.test(v)) {
          return true;
        }
        return false;
      },
    },
    {
      fields: ["SumName"],
      rule: function(v) {
        const re = /^\d{1,4}$/;
        if(re.test(v)) {
          return true;
        }
        return false;
      },
    },
  ],
  "update" : [
    {
      fields: ["Amount1Name", "Amount2Name", "Amount3Name"],
      rule: function(name, val, doc, needUpdateElement) {
        const targets = ["SumName"];
        const fields = ["Amount1Name", "Amount2Name", "Amount3Name"];
        const el = doc.getElementById("ID_" + name);
        const oldValue = el?.getAttribute("data-oldvalue") || 0;
        const delta = parseInt(val) - parseInt(oldValue);
        console.log("delta: ", delta);
        if(delta === 0) {return;}
        const enableHeaderInterceptor = () => {
          // replace header to show intercept dialog when click back icon, instead of back to previous page.
          const elInterceptor = doc.getElementById("ID_Header_Interception");
          if(!elInterceptor || elInterceptor.getAttribute("hide") !== 'true') {return}
          const elBack = doc.getElementById("ID_Header");
          if(!elBack) {return}
          elBack.setAttribute('hide', 'true');
          elInterceptor.setAttribute('hide', 'false');
          needUpdateElement(elBack);
          needUpdateElement(elInterceptor);
        }
        let sum = 0;
        fields.forEach(item => {
          const field = doc.getElementById("ID_" + item);
          if(field) {
            let value = field.getAttribute("value") || 0;
            sum += parseInt(value);
          }
        })
        const target = doc.getElementById("ID_SumName");
        enableHeaderInterceptor();
        // MUST call needUpdateElement() at the last end!
        el.setAttribute("data-oldvalue", val);
        needUpdateElement(el);
        target.setAttribute("value", sum);
        needUpdateElement(target);
      }
    },
    {
      fields: ["SumName"],
      rule: function(name, val, doc, needUpdateElement) {
        const fields = [
          {name: "Amount1Name", ratio: "10%"},
          {name: "Amount2Name", ratio: "30%"},
          {name: "Amount3Name", ratio: "60%"}
        ];
        const el = doc.getElementById("ID_" + name);
        const oldValue = el?.getAttribute("data-oldvalue") || 0;
        const delta = parseInt(val) - parseInt(oldValue);
        console.log("delta: ", delta);
        if(delta === 0) {return;}
        const enableHeaderInterceptor = () => {
          // replace header to show intercept dialog when click back icon, instead of back to previous page.
          const elInterceptor = doc.getElementById("ID_Header_Interception");
          if(!elInterceptor || elInterceptor.getAttribute("hide") !== 'true') {return}
          const elBack = doc.getElementById("ID_Header");
          if(!elBack) {return}
          elBack.setAttribute('hide', 'true');
          elInterceptor.setAttribute('hide', 'false');
          needUpdateElement(elBack);
          needUpdateElement(elInterceptor);
        }
        const elementsUpdate = [];
        fields.forEach(({name, ratio}) => {
          const field = doc.getElementById("ID_" + name);
          if(field) {
            let value = Math.floor(val * parseInt(ratio) / 100);
            field.setAttribute("data-oldvalue", field.getAttribute("value"));
            field.setAttribute("value", value);
            elementsUpdate.push(field);
          }
        })
        // MUST call needUpdateElement() at the last end!
        enableHeaderInterceptor();
        elementsUpdate.forEach(item => needUpdateElement(item));
        el.setAttribute("data-oldvalue", val);
        needUpdateElement(el);
      }
    },
  ]
}

// ]]>
</text>
