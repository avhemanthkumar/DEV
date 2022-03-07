({
    doInit : function(component, event, helper) {
        var opplist = component.get("c.getRelatedList");
        

        opplist.setParams({
            recordId:component.get("v.recordId")
    	});
       
        opplist.setCallback(this, function(data) {
            
            component.set("v.OpportunityList", data.getReturnValue());
            component.set("v.url", window.location.origin);
            
        });
        $A.enqueueAction(opplist);
    }
   
})
