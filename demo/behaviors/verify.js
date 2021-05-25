import type { DOMString, Document, Element } from 'hyperview/src/types';
import { shallowCloneToRoot } from 'hyperview/src/services';

const verifyBehavior = {
  action: 'verify',
  callback: (element: Element,
    onUpdate: HvComponentOnUpdate,
    getRoot: HvGetRoot,
    updateRoot: HvUpdateRoot) => {
    _verify({
      element,
      onUpdate,
      getRoot,
      updateRoot
    })
  }
};

const _verify = ({ element,
  onUpdate,
  getRoot,
  updateRoot }) => {
  let doc: Document = getRoot();
  let newRoot: Document;
  let isValid = false;
  let isNeedUpdate: boolean = false;

  const _needUpdateElement = (el: Element) => {
    isNeedUpdate = true;
    newRoot = shallowCloneToRoot(el);
    // need update doc, otherwise old doc.documentElement === null here.
    doc = newRoot;
  };

  const _updateLinkageFields = () => {
    const updateMethod = methods['update'];
    if (updateMethod?.length > 0) {
      updateMethod.forEach((obj: { fields: []; rule: Function }) => {
        if (obj.fields?.includes(name)) {
          obj.rule(name, newValue, doc, _needUpdateElement);
        }
      });
    }
  };

  const _showSubmitButton = (isShowSubmit: boolean) => {
    const submitBtnInActive = doc.getElementById('ID_SubmitBtn_NonActive');
    const submitBtnActive = doc.getElementById('ID_SubmitBtn_Active');
    if (!submitBtnInActive || !submitBtnActive) {
      return;
    }
    const isInactiveHide = submitBtnInActive.getAttribute('hide');
    const isActiveHide = submitBtnActive.getAttribute('hide');

    if (isShowSubmit && isActiveHide === 'true' && isInactiveHide !== 'true') {
      // enable active button, disable inactive button
      submitBtnInActive.setAttribute('hide', true);
      submitBtnActive.setAttribute('hide', false);
      _needUpdateElement(submitBtnInActive);
      _needUpdateElement(submitBtnActive);
    } else if (!isShowSubmit && isInactiveHide === 'true' && isActiveHide !== 'true') {
      // disable active button if needed
      submitBtnActive.setAttribute('hide', true);
      submitBtnInActive.setAttribute('hide', false);
      _needUpdateElement(submitBtnInActive);
      _needUpdateElement(submitBtnActive);
    }
  };

  const targetElement: Element = element.tagName === 'behavior' ? element.parentNode : element;
  const name: string = targetElement.getAttribute('name') || '';
  const newValue: string = targetElement.getAttribute('value') || '';
  // get verify code snippet
  const code = doc.getElementById('ID_VerifyCode')?.textContent;
  if (!code) {
    return;
  }

  const methods = Function('return (' + code + ')')();
  const verifyMethods = methods['verify'];
  verifyMethods.find((obj: { fields: []; rule: Function }) => {
    if (obj.fields?.includes(name)) {
      isValid = obj.rule(newValue);
      return true;
    }
  });

  // find the next errer message element, the next element MUST be error message element
  let errMsgElement = targetElement.nextSibling;
  while (errMsgElement && errMsgElement.nodeType !== 1) {
    errMsgElement = errMsgElement.nextSibling;
  }
  if (errMsgElement) {
    const isHide = errMsgElement.getAttribute('hide');
    if (isValid === false && isHide === 'true') {
      // invalid, show error msg
      errMsgElement.setAttribute('hide', false);
      _needUpdateElement(errMsgElement);
    } else if (isValid && isHide !== 'true') {
      // valid, hide error msg
      errMsgElement.setAttribute('hide', true);
      _needUpdateElement(errMsgElement);
    }
  }

  // verify all input field, to determine if active submit button
  if (isValid) {
    // update linkage fields if needed
    _updateLinkageFields();
    const allValid = verifyMethods.every((obj: { fields: []; rule: Function }) => {
      return (
        obj.fields &&
        obj.fields.every((item: string) => {
          const el = doc.getElementById('ID_' + item);
          if (el) {
            const value = el.getAttribute('value');
            return obj.rule(value);
          }
        })
      );
    });

    if (allValid) {
      _showSubmitButton(true);
    }
  } else {
    _showSubmitButton(false);
  }

  // If using delay, we need to undo the indicators shown earlier.
  // if (delay > 0) {
  //   newRoot = Behaviors.setIndicatorsAfterLoad(
  //     showIndicatorIds,
  //     hideIndicatorIds,
  //     newRoot,
  //   );
  // }
  // Update the DOM with the new shown state and finished indicators.

  if (isNeedUpdate) {
    updateRoot(newRoot);
  }
};

export default verifyBehavior;


