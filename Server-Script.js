(function execute(inputs, outputs) {
// ... code ...
  
  var S_Date = inputs.SDATE;
  var E_Date= inputs.EDATE;
  var C_sys_id= inputs.cureent_SYS_ID;
  var AG_sys_id= inputs.AG_SYS_ID;
  
var Headers = ["Number","Caller","Short Desc","Assignment Group", "Assigned To", "Response Time"];
var fileName = 'Incidents-with-RTR.csv';
var csvData = ''; //The variable CSV data will contain a string which is used to build the CSV file contents
for (var i = 0; i < Headers.length; i++) { //Build the Headers
	csvData = csvData + '"' + Headers[i] + '"' + ',';
}
csvData = csvData+"\r\n";

var gr = new GlideRecord("incident");
gr.addEncodedQuery("sys_created_on>=javascript:gs.dateGenerate('" + S_Date + "','00:00:00')^sys_created_on<=javascript:gs.dateGenerate('" + E_Date + "','23:59:59')^assignment_group=" + AG_sys_id );
gr.addActiveQuery();
gr.query();
while(gr.next()) {
  
        var opened_time = gr.opened_at.getDisplayValue(); // Opened At
        var updated_on = gr.u_response_time.getDisplayValue(); // Updated At

        var Assignee_duration = gs.dateDiff(opened_time, updated_on); // Duration of ( Updated At - Opened At )
  
	csvData = csvData + '"' + gr.number + '",' + '"' + gr.caller_id.getDisplayValue() + '",' + '"' + gr.short_description+'",' + '"' + gr.assignment_group.getDisplayValue() + '",' + '"' + gr.assigned_to.getDisplayValue() + '",' + Assignee_duration;
	csvData = csvData+"\r\n";
}

//Attach the file to a record.
var grRec = new GlideRecord("sc_req_item");
grRec.addQuery("sys_id", C_sys_id );
grRec.query();
if(grRec.next()){
	var grAttachment = new GlideSysAttachment();
	grAttachment.write(grRec, fileName, 'application/csv',csvData);
}
  outputs.op = 'false';
})(inputs, outputs);

