
export function getUserRole(userId, community) {
    if (!community || !community.members) return null;
    if (!userId) return null;
   const member = community.members.find(m => m.user.toString() === userId.toString());
   if (!member) return null;
   return member.role;
}
export function canAddProject(userId , community){
    if (!community || !community.members) return false;
    if (!userId) return false;
    const role = getUserRole(userId,community);
    console.log(role);
    if(role === "owner" || role === "admin"){
        return true;
    }
    return false;
}

export function canRemoveMember(userId,community,targetUserId){
    if (!community || !community.members) return false;
    if (!userId) return false;
    if(!targetUserId)return false;
    const role= getUserRole(userId,community);
    const targetRole = getUserRole(targetUserId,community);
    if(role == "owner"){
        return true;
    }
    else if(role == "admin" && targetRole != "owner"){
        return true;
    }
    else{
        return false;
    }
    
}

export function canDeleteCommunity(userId,community){
    if (!community || !community.members) return false;
    if (!userId) return false;
    const role = getUserRole(userId,community);
    if(role == "owner"){
        return true;
    }
    return false;
}
export function canViewCommunity(userId,community){
    if (!community || !community.members) return false;
    if (!userId) return false;
    const role = getUserRole(userId,community);
    if(role == "owner" || role == "admin" || role == "member"){
        return true;
    }
    return false;
}

export function canEditProject(userId,community){
    if (!community || !community.members) return false;
    if (!userId) return false;
    const role = getUserRole(userId,community);
    if(role == "owner" || role == "admin"){
        return true;
    }
    return false;
}


export function canRemoveProject(userId, community) {
  const role = getUserRole(userId, community);
  return role === "owner";
}
