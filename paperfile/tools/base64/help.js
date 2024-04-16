// 定义一个函数，用于显示帮助信息的弹出窗口
function showHelp() {
  var helpModal = document.createElement("div");
  helpModal.id = "helpModal";
  helpModal.style.display = "block";
  helpModal.style.position = "fixed";
  helpModal.style.zIndex = "1";
  helpModal.style.paddingTop = "100px";
  helpModal.style.left = "0";
  helpModal.style.top = "0";
  helpModal.style.width = "100%";
  helpModal.style.height = "100%";
  helpModal.style.overflow = "auto";
  helpModal.style.backgroundColor = "rgb(0,0,0)";
  helpModal.style.backgroundColor = "rgba(0,0,0,0.4)";

  var helpContent = document.createElement("div");
  helpContent.style.backgroundColor = "#fefefe";
  helpContent.style.margin = "auto";
  helpContent.style.padding = "20px";
  helpContent.style.border = "1px solid #888";
  helpContent.style.width = "80%";

  var helpText = document.createElement("p");
  helpText.innerHTML = "<b>关于编码已选文件：</b><br>上传一个文件，然后点击“编码已选文件”即可获得一个使用base64编码的dataURL；<br>当你的文件编码后小于1MB，它将被显示在结果框中；<br>当它大于1MB，它仅可以通过下载结果来获取。<br>因为将一个很长的字符串放在一个输入框中会将这个页面卡爆。<br><br><b>注意事项：</b><br>由于有些文件编码后非常大，你不能直接将那个dataURL复制到输入框中。<br>所以编码大文件并点击下载结果时，将会下载一个存储着base64编码的dataURL的TXT文件，下次直接将TXT作为文件上传然后点击解码即可。<br><br><br><b>解码已选文件：</b><br>可以在输入框输入dataURL或者选择一个包含着dataURL的TXT文件进行解码。<br>有一些文件很大，编码后的dataURL超级长，所以把它粘贴在输入框是不现实的，这时你只能上传TXT文件。";

  helpContent.appendChild(helpText);
  helpModal.appendChild(helpContent);

  document.body.appendChild(helpModal);

  // 点击窗口外的区域关闭弹窗
  window.onclick = function (event) {
    if (event.target == helpModal) {
      helpModal.style.display = "none";
      document.body.removeChild(helpModal);
    }
  }
}
