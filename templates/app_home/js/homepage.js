"use strict"
{% load static %}

var host_addr = "{{ api_url }}"
console.log(host_addr);

$(document).ready(function(){
    var jsonObject = JSON.parse('{{ lang_config | escapejs }}');
    initTabs(jsonObject);

    $('.nav-link').unbind('click.dispVersion',displayCompilerVersion);
    $('.nav-link').bind('click.dispVersion',displayCompilerVersion);

    $('.execute').unbind('click.compile',compile);
    $('.execute').bind('click.compile',compile);
});

function initTabs(lang_config){
    // console.log(lang_config);
    var count = 1;
    for (let key in lang_config) {
        // console.log(key, lang_config[key]);
        var btn_id = lang_config[key].extension+"-tab";
        var btn_target_id = "editor-"+lang_config[key].extension;
        var btn_extension = lang_config[key].extension;
        var btn_class = "nav-link pe-3";
        var aria_selected = false;
        var helper_code = lang_config[key].default_helper_code;
        if(count === 1){
            btn_class += " active";
            aria_selected = true;
        }
        var text = "<button class='"+btn_class+"' id='"+btn_id+"' data-bs-toggle='tab' data-bs-target='#"+btn_target_id+"'   type='button' role='tab' aria-controls='"+btn_extension+"' aria-selected='"+aria_selected+"'>"+key+"</button>"
        
        $("#v-pills-tab").append(text);

        updateEditor(key,btn_id,btn_target_id,btn_extension,helper_code);
        count++;
    };
}

function updateEditor(lang,id,target_id,extension,helper_code){
    var class_name_input = ""
    if(lang === "java"){

    }

    var editor_section = `<div class="tab-pane fade editor-segment" id="`+target_id+`" role="tabpanel" aria-labelledby="`+id+`">
        <div class="row">
            <div class="col">
                <button type="button" data-id="`+extension+`" class="btn btn-primary float-end w-25 execute" id="run_`+extension+`">Execute `+lang+`</button>
            </div>
        </div>
        <div class="row editor-area">
            <div class="col">
                <div class="row mb-2">
                    <div class="col">
                        <textarea class="form-control source-code-area" id="sourceCodeArea_`+extension+`" wrap="hard" data-id="`+extension+`" rows="15" placeholder="Type your `+lang+` code/statement here..." required>`+helper_code+`</textarea>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label for="stdinArea p-10">STDIN:</label>
                        <textarea class="form-control stdin mt-2" id="stdinArea_`+extension+`" wrap="hard" rows="4" data-id="`+extension+`" placeholder="stdin" required></textarea>
                    </div>
                </div>
            </div>
            <div class="col">
                <textarea class="form-control output-area" id="outputArea_`+extension+`" rows="22" data-id="`+extension+`" placeholder="output" onhover='displayCompilerVersion' readonly></textarea>
            </div>
        </div>
    </div>`

    $(".tab-content").append(editor_section);
}

function displayCompilerVersion(event){
    // console.log(event);
    var data_id = {lang : $(event.currentTarget).attr('aria-controls')};
    var output_area = $('#outputArea_'+data_id.lang);
    $.ajax({
        type: "GET",
        url: host_addr+'/api/lang_comp_ver/'+data_id.lang+'/',
        cache: false,
        async: true,      
        success: function(res){
            if(res.status === "success"){
                // console.log(output_area);
                output_area.val(">>>> Compiler: "+res.output+" Loaded....") 
            }
            else{
                console.log(res);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else if (jqXHR.status == 405) {
                msg = 'Invalid Method [405].';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.log(msg);
        }        
    });
}

function compile(event){
    // console.log(event);
    var data_id = $(event.currentTarget).attr('data-id');
    var source_code = $('#sourceCodeArea_'+data_id).val(); 
    var stdin = $('#stdinArea_'+data_id).val(); 
    console.log("data_id: ",data_id);
    console.log(source_code);
    console.log(stdin);
}


