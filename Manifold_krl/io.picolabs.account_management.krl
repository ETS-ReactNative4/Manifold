//-----------------------------------------------------------------------------
//--------                       Account Management                   ---------
//-----------------------------------------------------------------------------
ruleset io.picolabs.account_management {
  meta {
    shares __testing
    use module io.picolabs.wrangler alias wrangler
  }
  global {
    __testing = { "queries": [ { "name": "__testing" } ],
                  "events": [ { "domain": "owner", "type": "creation",
                                "attrs": [ "name", "password" ] },
                              { "domain": "wrangler", "type": "ruleset_added",
                                "attrs": [ "rids" ] },
                              { "domain": "owner", "type": "eci_requested",
                                "attrs": [ "name" ] } ] }

    nameExists = function(ownername){
      ent:owners.defaultsTo({}) >< ownername
    }

    //this assumes you already checked whether or not the entered info was a DID
    getEciFromOwnerName = function(name){
      exists = nameExists(name);
      exists => ent:owners{name}{"eci"} | "No user found"
    }
  }//end global

//
//New owner account registration and management

rule create_admin{
  select when wrangler ruleset_added where rids.klog("rids") >< meta:rid.klog("meta rid")
  pre{}
  every {
    engine:newChannel(meta:picoId, "Router_" + time:now(), "route_to_owner") setting(new_channel)
  }
  fired{
    ent:owners := ent:owners.defaultsTo({}).put("root", {"eci": new_channel{"id"}});
    raise owner event "admin"
      attributes event:attrs();
  }
}

rule eci_from_owner_name{
  select when owner eci_requested
  pre{
    eciResult = getEciFromOwnerName(event:attr("owner_id"));
  }
  if eciResult != "No user found" then every{
    send_directive("Returning eci from owner name", {"eci": eciResult});
  }fired{
    raise owner event "login_attempt"
      attributes event:attrs().put({ "timestamp": time:now() });
  }else{
    raise owner event "login_attempt_failed"
      attributes event:attrs().put({ "timestamp": time:now() });
  }
}

  rule create_owner{
    select when owner creation
    pre{
      name = event:attr("name");
      password = event:attr("password");
      exists = nameExists(name);
    }
    if not exists then // may need to check pico name uniqueness
      send_directive("Creating owner", {"ownername":name});

    fired{
      raise wrangler event "new_child_request"
        attributes event:attrs().put({"event_type":"account","rids":"io.picolabs.owner_authentication", "password": password});
    }
    else{
      raise owner event "creation_failure"
        attributes event:attrs();
    }
  }

  rule owner_name_taken{
    select when owner creation_failure
    pre{}
    send_directive("ownername taken",{"ownername": event:attr("name")});
  }

  rule owner_token{
    select when owner token_created event_type re#account#
    pre{
      a=event:attrs().klog("all attrs: ")
      rs_attrs = event:attr("rs_attrs"){"rs_attrs"};
      new_owner = {"eci": event:attr("eci")}
    }
    fired{
      ent:owners := ent:owners.defaultsTo({}).put(rs_attrs{"name"}, new_owner);
    }
  }

}
